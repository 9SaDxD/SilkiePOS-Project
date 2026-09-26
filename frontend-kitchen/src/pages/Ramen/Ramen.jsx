// src/pages/Ramen/Ramen.jsx (ฉบับแก้ไข: Smart Merge)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header/Header';
import axios from 'axios';
import './Ramen.css';

const API_URL = 'http://localhost:3000/api/kitchen';
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
    if (!dateString) return "ไม่ระบุเวลา";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "ไม่ระบุเวลา";
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} น.`;
};

const Ramen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastServedOrder, setLastServedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      // 1. ดึงข้อมูลจาก API (จะได้เฉพาะรายการที่ Pending)
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

      // 2. ⭐️ Smart Merge: ผสานข้อมูลจาก API เข้ากับ State ปัจจุบัน
      setOrders(prevOrders => {
          // สร้าง Map ของข้อมูลใหม่
          const newOrdersMap = { ...apiOrders };
          const finalOrders = [];

          // วนลูปดูข้อมูลเก่า (เพื่อรักษา Done items)
          prevOrders.forEach(oldOrder => {
              const incomingOrder = newOrdersMap[oldOrder._id];

              if (incomingOrder) {
                  // Case A: บิลนี้ยังมีรายการ Pending มาจาก API
                  // เราจะเอา Pending จาก API + Done จาก Local State มารวมกัน
                  const doneItems = oldOrder.items.filter(i => i.itemStatus === 'Done');
                  
                  // เช็คไม่ให้ item ซ้ำ
                  const incomingIds = new Set(incomingOrder.items.map(i => i._id));
                  const mergedItems = [...incomingOrder.items];
                  
                  doneItems.forEach(doneItem => {
                      if (!incomingIds.has(doneItem._id)) {
                          mergedItems.push(doneItem);
                      }
                  });
                  
                  incomingOrder.items = mergedItems;
                  finalOrders.push(incomingOrder);
                  delete newOrdersMap[oldOrder._id]; // ลบออกจาก map เพื่อไม่ให้ใส่ซ้ำ
              } else {
                  // Case B: บิลนี้ไม่มีใน API แล้ว (แปลว่าเสร็จหมดแล้วใน DB)
                  // แต่เราอยากเก็บไว้แสดงผล (ขีดฆ่า) จนกว่าจะกดเสิร์ฟ
                  // ดังนั้นเราจะเก็บ Old Order ไว้ ถ้ามันยังมีรายการอยู่
                  if (oldOrder.items.length > 0) {
                      finalOrders.push(oldOrder);
                  }
              }
          });

          // ใส่บิลใหม่ที่เพิ่งเข้ามา (ที่ไม่มีใน prevOrders)
          Object.values(newOrdersMap).forEach(newOrder => {
              finalOrders.push(newOrder);
          });

          // เรียงลำดับตามเวลา
          return finalOrders.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      });

    } catch (error) { console.error('Error fetching orders:', error); } 
    finally { setLoading(false); }
  }, [kitchenType]);

  // ⭐️ แค่เปลี่ยนสถานะเป็น Done (ขีดฆ่า) ไม่ลบ
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
      
      // ยิง API บอก Backend ว่าเสร็จแล้ว (Backend จะเปลี่ยนเป็น Done และจะไม่ส่งกลับมาในการ fetch ครั้งหน้า)
      // แต่ Smart Merge ของเราจะเก็บ Done ไว้ให้เห็น
      await axios.post(`${API_URL}/item/${itemId}/toggle`);

    } catch (error) { 
        console.error('Error toggling done:', error);
        fetchOrders();
    }
  };

  // ⭐️ กดเสร็จสิ้นเมื่อทำหมดแล้ว
  const handleHeaderClick = async (order) => { 
    // เช็คว่าขีดฆ่าครบทุกอันหรือยัง
    const pendingItems = order.items.filter(item => item.itemStatus !== 'Done');
    
    if (pendingItems.length > 0) { 
        alert('ยังมีรายการที่ต้องทำ: ' + pendingItems.map(i => i.menuName).join(', ')); 
        return; 
    }
    
    // ลบออกจากหน้าจอ
    setLastServedOrder(order); 
    setOrders(prevOrders => prevOrders.filter(o => o._id !== order._id));

    // บอก Backend ว่าเสร็จแล้ว
    try {
      await axios.post(`${API_URL}/order/${order._id}/served`);
    } catch (error) {
      console.error('Error marking order served:', error);
    }
  };

  const handleUndo = async () => {
    if (!lastServedOrder) { alert("ไม่มีรายการให้ Undo"); return; }
    // (โค้ด Undo เหมือนเดิม)
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
        title={`ครัว${kitchenType}`}
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
                    <div className="order-info-ramen"><h3>โต๊ะ {order.table}</h3> {order.time}</div>
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