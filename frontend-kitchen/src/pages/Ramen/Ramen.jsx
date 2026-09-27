// src/pages/Ramen/Ramen.jsx (เธเธเธฑเธเนเธเนเนเธ: Smart Merge)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header/Header';
import axios from 'axios';
import './Ramen.css';

const API_URL = 'https://silkiepos-project.onrender.com/api/kitchen';
const kitchenType = "Ramen";

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

const Ramen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastServedOrder, setLastServedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      // 1. เธ”เธถเธเธเนเธญเธกเธนเธฅเธเธฒเธ API (เธเธฐเนเธ”เนเน€เธเธเธฒเธฐเธฃเธฒเธขเธเธฒเธฃเธ—เธตเน Pending)
      const response = await axios.get(`${API_URL}/orders/${kitchenType}`);
      const apiOrders = response.data.items.reduce((acc, item) => {
        const orderId = item.orderId._id; 
        if (!acc[orderId]) {
          acc[orderId] = {
            _id: orderId, 
            items: [], 
            table: item.tableId,
            time: formatTime(item.sentToKitchenAt),
            name: item.orderId.tableId, 
            status: item.orderId.status,
            sentAt: item.sentToKitchenAt
          };
        }
        acc[orderId].items.push(item);
        return acc;
      }, {});

      // 2. โญ๏ธ Smart Merge: เธเธชเธฒเธเธเนเธญเธกเธนเธฅเธเธฒเธ API เน€เธเนเธฒเธเธฑเธ State เธเธฑเธเธเธธเธเธฑเธ
      setOrders(prevOrders => {
          // เธชเธฃเนเธฒเธ Map เธเธญเธเธเนเธญเธกเธนเธฅเนเธซเธกเน
          const newOrdersMap = { ...apiOrders };
          const finalOrders = [];

          // เธงเธเธฅเธนเธเธ”เธนเธเนเธญเธกเธนเธฅเน€เธเนเธฒ (เน€เธเธทเนเธญเธฃเธฑเธเธฉเธฒ Done items)
          prevOrders.forEach(oldOrder => {
              const incomingOrder = newOrdersMap[oldOrder._id];

              if (incomingOrder) {
                  // Case A: เธเธดเธฅเธเธตเนเธขเธฑเธเธกเธตเธฃเธฒเธขเธเธฒเธฃ Pending เธกเธฒเธเธฒเธ API
                  // เน€เธฃเธฒเธเธฐเน€เธญเธฒ Pending เธเธฒเธ API + Done เธเธฒเธ Local State เธกเธฒเธฃเธงเธกเธเธฑเธ
                  const doneItems = oldOrder.items.filter(i => i.itemStatus === 'Done');
                  
                  // เน€เธเนเธเนเธกเนเนเธซเน item เธเนเธณ
                  const incomingIds = new Set(incomingOrder.items.map(i => i._id));
                  const mergedItems = [...incomingOrder.items];
                  
                  doneItems.forEach(doneItem => {
                      if (!incomingIds.has(doneItem._id)) {
                          mergedItems.push(doneItem);
                      }
                  });
                  
                  incomingOrder.items = mergedItems;
                  finalOrders.push(incomingOrder);
                  delete newOrdersMap[oldOrder._id]; // เธฅเธเธญเธญเธเธเธฒเธ map เน€เธเธทเนเธญเนเธกเนเนเธซเนเนเธชเนเธเนเธณ
              } else {
                  // Case B: เธเธดเธฅเธเธตเนเนเธกเนเธกเธตเนเธ API เนเธฅเนเธง (เนเธเธฅเธงเนเธฒเน€เธชเธฃเนเธเธซเธกเธ”เนเธฅเนเธงเนเธ DB)
                  // เนเธ•เนเน€เธฃเธฒเธญเธขเธฒเธเน€เธเนเธเนเธงเนเนเธชเธ”เธเธเธฅ (เธเธตเธ”เธเนเธฒ) เธเธเธเธงเนเธฒเธเธฐเธเธ”เน€เธชเธดเธฃเนเธ
                  // เธ”เธฑเธเธเธฑเนเธเน€เธฃเธฒเธเธฐเน€เธเนเธ Old Order เนเธงเน เธ–เนเธฒเธกเธฑเธเธขเธฑเธเธกเธตเธฃเธฒเธขเธเธฒเธฃเธญเธขเธนเน
                  if (oldOrder.items.length > 0) {
                      finalOrders.push(oldOrder);
                  }
              }
          });

          // เนเธชเนเธเธดเธฅเนเธซเธกเนเธ—เธตเนเน€เธเธดเนเธเน€เธเนเธฒเธกเธฒ (เธ—เธตเนเนเธกเนเธกเธตเนเธ prevOrders)
          Object.values(newOrdersMap).forEach(newOrder => {
              finalOrders.push(newOrder);
          });

          // เน€เธฃเธตเธขเธเธฅเธณเธ”เธฑเธเธ•เธฒเธกเน€เธงเธฅเธฒ
          return finalOrders.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      });

    } catch (error) { console.error('Error fetching orders:', error); } 
    finally { setLoading(false); }
  }, [kitchenType]);

  // โญ๏ธ เนเธเนเน€เธเธฅเธตเนเธขเธเธชเธ–เธฒเธเธฐเน€เธเนเธ Done (เธเธตเธ”เธเนเธฒ) เนเธกเนเธฅเธ
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
      
      // เธขเธดเธ API เธเธญเธ Backend เธงเนเธฒเน€เธชเธฃเนเธเนเธฅเนเธง (Backend เธเธฐเน€เธเธฅเธตเนเธขเธเน€เธเนเธ Done เนเธฅเธฐเธเธฐเนเธกเนเธชเนเธเธเธฅเธฑเธเธกเธฒเนเธเธเธฒเธฃ fetch เธเธฃเธฑเนเธเธซเธเนเธฒ)
      // เนเธ•เน Smart Merge เธเธญเธเน€เธฃเธฒเธเธฐเน€เธเนเธ Done เนเธงเนเนเธซเนเน€เธซเนเธ
      await axios.post(`${API_URL}/item/${itemId}/toggle`);

    } catch (error) { 
        console.error('Error toggling done:', error);
        fetchOrders();
    }
  };

  // โญ๏ธ เธเธ”เน€เธชเธฃเนเธเธชเธดเนเธเน€เธกเธทเนเธญเธ—เธณเธซเธกเธ”เนเธฅเนเธง
  const handleHeaderClick = async (order) => { 
    // เน€เธเนเธเธงเนเธฒเธเธตเธ”เธเนเธฒเธเธฃเธเธ—เธธเธเธญเธฑเธเธซเธฃเธทเธญเธขเธฑเธ
    const pendingItems = order.items.filter(item => item.itemStatus !== 'Done');
    
    if (pendingItems.length > 0) { 
        alert('เธขเธฑเธเธกเธตเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเธ•เนเธญเธเธ—เธณ: ' + pendingItems.map(i => i.menuName).join(', ')); 
        return; 
    }
    
    // เธฅเธเธญเธญเธเธเธฒเธเธซเธเนเธฒเธเธญ
    setLastServedOrder(order); 
    setOrders(prevOrders => prevOrders.filter(o => o._id !== order._id));

    // เธเธญเธ Backend เธงเนเธฒเน€เธชเธฃเนเธเนเธฅเนเธง
    try {
      await axios.post(`${API_URL}/order/${order._id}/served`);
    } catch (error) {
      console.error('Error marking order served:', error);
    }
  };

  const handleUndo = async () => {
    if (!lastServedOrder) { alert("เนเธกเนเธกเธตเธฃเธฒเธขเธเธฒเธฃเนเธซเน Undo"); return; }
    // (เนเธเนเธ” Undo เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
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

      <div className="order-container-ramen">
        {orders.map((order) => {
             const isAllDone = order.items.every(item => item.itemStatus === 'Done');
             return (
                <div className="order-box-ramen" key={order._id}>
                  <div 
                    className={`order-header-ramen ${isAllDone ? 'ready' : ''} ${getAgeClass(order.sentAt)}`}
                    onClick={() => handleHeaderClick(order)}
                  >
                    <div className="order-info-ramen"><h3>เนเธ•เนเธฐ {order.table}</h3> {order.time}</div>
                  </div>
                  <ul className="menu-list-ramen">
                    {order.items.map((item) => (
                      <li
                        key={item._id}
                        className={item.itemStatus === 'Done' ? 'done-ramen' : ''}
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

export default Ramen;


