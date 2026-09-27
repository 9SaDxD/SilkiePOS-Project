// src/pages/Fry/Fry.jsx (เธเธเธฑเธเนเธเนเนเธ: Smart Merge)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header/Header';
import axios from 'axios';
import './Fry.css';

const API_URL = 'https://silkiepos-project.onrender.com/api/kitchen';
const kitchenType = "Fry";

const getAgeClass = (sentAt) => {
  const now = new Date();
  const sentTime = new Date(sentAt);
  const minutesElapsed = (now - sentTime) / 1000 / 60;
  if (minutesElapsed > 7) return 'age-red';
  if (minutesElapsed > 3) return 'age-yellow';
  return 'age-green';
};

const formatTime = (dateString) => {
    if (!dateString) return "เนเธกเนเธฃเธฐเธเธธเน€เธงเธฅเธฒ";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "เนเธกเนเธฃเธฐเธเธธเน€เธงเธฅเธฒ";
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} เธ.`;
};

const Fry = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastServedOrder, setLastServedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${kitchenType}`);
      const apiOrders = response.data.items.reduce((acc, item) => {
        const orderId = item.orderId._id; 
        if (!acc[orderId]) {
          acc[orderId] = {
            _id: orderId, items: [], table: item.tableId,
            time: formatTime(item.sentToKitchenAt),
            name: item.orderId.tableId, status: item.orderId.status,
            sentAt: item.sentToKitchenAt
          };
        }
        acc[orderId].items.push(item);
        return acc;
      }, {});

      // โญ๏ธ Smart Merge Logic
      setOrders(prevOrders => {
          const newOrdersMap = { ...apiOrders };
          const finalOrders = [];

          prevOrders.forEach(oldOrder => {
              const incomingOrder = newOrdersMap[oldOrder._id];
              if (incomingOrder) {
                  const doneItems = oldOrder.items.filter(i => i.itemStatus === 'Done');
                  const incomingIds = new Set(incomingOrder.items.map(i => i._id));
                  const mergedItems = [...incomingOrder.items];
                  doneItems.forEach(doneItem => {
                      if (!incomingIds.has(doneItem._id)) mergedItems.push(doneItem);
                  });
                  incomingOrder.items = mergedItems;
                  finalOrders.push(incomingOrder);
                  delete newOrdersMap[oldOrder._id];
              } else {
                  if (oldOrder.items.length > 0) {
                      finalOrders.push(oldOrder);
                  }
              }
          });
          Object.values(newOrdersMap).forEach(newOrder => finalOrders.push(newOrder));
          return finalOrders.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      });

    } catch (error) { console.error('Error fetching orders:', error); } 
    finally { setLoading(false); }
  }, [kitchenType]);

  const handleItemClick = async (itemId, orderId) => {
    try {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order._id === orderId) {
            const newItems = order.items.map(item => {
              if (item._id === itemId) {
                const nextStatus = item.itemStatus === 'Done' ? 'Pending' : 'Done';
                return { ...item, itemStatus: nextStatus };
              }
              return item;
            });
            return { ...order, items: newItems };
          }
          return order;
        })
      );
      await axios.post(`${API_URL}/item/${itemId}/toggle`);
    } catch (error) { 
        console.error('Error toggling done:', error);
        fetchOrders();
    }
  };

  const handleHeaderClick = async (order) => { 
    const pendingItems = order.items.filter(item => item.itemStatus !== 'Done');
    if (pendingItems.length > 0) { 
        alert('เธขเธฑเธเธกเธตเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเธ•เนเธญเธเธ—เธณ: ' + pendingItems.map(i => i.menuName).join(', ')); 
        return; 
    }
    
    setLastServedOrder(order); 
    setOrders(prevOrders => prevOrders.filter(o => o._id !== order._id));

    try {
      await axios.post(`${API_URL}/order/${order._id}/served`);
    } catch (error) {
      console.error('Error marking order served:', error);
    }
  };

  const handleUndo = async () => {
    if (!lastServedOrder) { alert("เนเธกเนเธกเธตเธฃเธฒเธขเธเธฒเธฃเนเธซเน Undo"); return; }
    const orderToRestore = { ...lastServedOrder, status: 'Ready' };
    const undoneOrderId = lastServedOrder._id;
    setLastServedOrder(null); 
    setOrders(prevOrders => {
      const newList = [...prevOrders, orderToRestore];
      newList.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      return newList;
    });
    try { await axios.post(`${API_URL}/order/${undoneOrderId}/undo`); } 
    catch (error) { console.error('Error undoing order:', error); }
  };
  
  useEffect(() => { 
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); 
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  if (loading && orders.length === 0) { return <div>Loading orders...</div>; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header 
        title={`เธเธฃเธฑเธง${kitchenType}`}
        onBack={() => navigate("/")} 
        onRefresh={handleUndo} 
      />

      <div className="order-container-fry">
        {orders.map((order) => {
            const isAllDone = order.items.every(item => item.itemStatus === 'Done');
            return (
              <div className="order-box-fry" key={order._id}>
                <div 
                  className={`order-header-fry ${isAllDone ? 'ready' : ''} ${getAgeClass(order.sentAt)}`}
                  onClick={() => handleHeaderClick(order)}
                >
                  <div className="order-info-fry"><h3>เนเธ•เนเธฐ {order.table}</h3>{order.time}</div>
                </div>
                <ul className="menu-list-fry">
                  {order.items.map((item) => (
                    <li
                      key={item._id}
                      className={item.itemStatus === 'Done' ? 'done-fry' : ''}
                      onClick={() => handleItemClick(item._id, order._id)}
                    >
                      {item.menuName} {item.quantity && `x${item.quantity}`}
                      {item.note && <div style={{fontSize: '0.8em', color: 'red'}}>({item.note})</div>}
                    </li>
                  ))}
                </ul>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Fry;


