import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 1. (ใหม่) Import hooks สำหรับอ่าน URL และนำทาง
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

import MenuCard from '../components/MenuCard';
import OrderSummary from '../components/OrderSummary';
import EditItemPage from '../components/EditItemPage'; 
import './OrderPage.css';

// ... (โค้ด groupMenusByCategory และ filterCategories เหมือนเดิม) ...
const groupMenusByCategory = (menus) => {
    const groups = {
        Ramen: { key: 'Ramen', title: 'ราเมง', items: [] },
        Fry: { key: 'Fry', title: 'ของทอด', items: [] },
        Drink: { key: 'Drink', title: 'เครื่องดื่ม', items: [] },
        Other: { key: 'Other', title: 'อื่นๆ', items: [] },
    };
    for (const menu of menus) {
        if (groups[menu.kitchenType]) {
            groups[menu.kitchenType].items.push(menu);
        } else {
            groups.Other.items.push(menu);
        }
    }
    return Object.values(groups).filter(group => group.items.length > 0);
};
const filterCategories = [
    { key: 'All', title: 'เมนูทั้งหมด' },
    { key: 'Ramen', title: 'ราเมง' },
    { key: 'Fry', title: 'ของทอด' },
    { key: 'Drink', title: 'เครื่องดื่ม' },
];


function OrderPage() {
    // 2. (ใหม่) เรียกใช้ hooks
    const { tableId } = useParams(); // อ่าน "tableId" จาก URL
    const navigate = useNavigate();   // ตัวช่วยพากลับ
    const { toggleSidebar } = useOutletContext();

    // ... (States ทั้งหมดเหมือนเดิม) ...
    const [menus, setMenus] = useState([]);
    const [groupedMenus, setGroupedMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null); 
    const [currentOrder, setCurrentOrder] = useState({});

    // ... (useEffect fetchMenus เหมือนเดิม) ...
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get(`https://silkiepos-project.onrender.com/api/staff/menus`);
                setMenus(response.data);
                setGroupedMenus(groupMenusByCategory(response.data));
            } catch (error) { console.error('Error fetching menus:', error); } 
            finally { setLoading(false); }
        };
        fetchMenus();
    }, []);

    // ... (Handlers (handleItemAdd, Remove, Update, Delete) เหมือนเดิม) ...
    const handleItemAdd = (menuId) => {
        const cartItem = currentOrder[menuId];
        if (cartItem) {
            setCurrentOrder({...currentOrder, [menuId]: { ...cartItem, quantity: cartItem.quantity + 1 }});
        } else {
            setCurrentOrder({...currentOrder, [menuId]: { quantity: 1, notes: [], comment: "" } });
        }
    };
    const handleItemRemove = (menuId) => {
        const cartItem = currentOrder[menuId];
        if (!cartItem) return;
        if (cartItem.quantity === 1) {
            handleItemDelete(menuId);
        } else {
            setCurrentOrder({...currentOrder, [menuId]: { ...cartItem, quantity: cartItem.quantity - 1 }});
        }
    };
    const handleItemUpdate = (menuId, newQuantity, newNotes, newComment) => {
        if (newQuantity <= 0) {
            handleItemDelete(menuId);
        } else {
            setCurrentOrder({...currentOrder, [menuId]: { quantity: newQuantity, notes: newNotes, comment: newComment }});
        }
        setEditingItemId(null);
    };
    const handleItemDelete = (menuId) => {
        const newOrder = { ...currentOrder };
        delete newOrder[menuId];
        setCurrentOrder(newOrder);
        setEditingItemId(null);
    };
    const handleOpenSummary = () => {
        if (getTotalItemCount() === 0) {
            alert("กรุณาเลือกรายการอาหาร"); return;
        }
        setIsSummaryOpen(true);
    };

    // --- 👇 3. (แก้ไข) นี่คือส่วนที่ "ส่งไปครัว" ---
    const handleConfirmOrder = async () => {
        const items = Object.keys(currentOrder).map(menuId => {
            const cartItem = currentOrder[menuId];
            const allNotes = [...cartItem.notes, cartItem.comment].filter(Boolean);
            return {
                menuId: menuId,
                quantity: cartItem.quantity,
                note: allNotes.join(', ')
            };
        });
        
        // (ใหม่) ใช้ tableId จาก URL ที่เราอ่านมา
        const orderData = {
            tableId: tableId, 
            items: items
        };

        try {
            // (ใหม่) ยิง API ไปที่ Backend
            const response = await axios.post(`https://silkiepos-project.onrender.com/api/staff/orders`, orderData);
            
            console.log("ส่งออเดอร์สำเร็จ:", response.data);
            alert(`ออเดอร์สำหรับโต๊ะ ${tableId} ถูกส่งไปที่ครัวแล้ว!`);
            
            // ล้างตะกร้า, ปิดหน้าสรุป, และพากลับหน้าแรก
            setCurrentOrder({});
            setIsSummaryOpen(false);
            navigate('/'); // 👈 พากลับหน้าเลือกโต๊ะ

        } catch (error) {
            console.error("Error creating order:", error);
            alert("เกิดข้อผิดพลาดในการส่งออเดอร์: " + error.message);
        }
    };

    // ... (Logic คำนวณ (getTotalItemCount, getTotalPrice) เหมือนเดิม) ...
    const getTotalItemCount = () => {
        return Object.values(currentOrder).reduce((sum, item) => sum + item.quantity, 0);
    };
    const getTotalPrice = () => {
        return Object.keys(currentOrder).reduce((total, menuId) => {
            const menu = menus.find(m => m.menuId === menuId);
            const quantity = currentOrder[menuId].quantity;
            if (menu) {
                return total + (menu.price * quantity);
            }
            return total;
        }, 0);
    };
    
    // ... (Logic การกรอง displayGroups เหมือนเดิม) ...
    let displayGroups = selectedCategory === 'All'
        ? groupedMenus
        : groupedMenus.filter(group => group.key === selectedCategory);
    if (searchText.trim() !== '') {
        displayGroups = displayGroups.map(group => ({
            ...group,
            items: group.items.filter(item => 
                item.name.toLowerCase().includes(searchText.toLowerCase())
            )
        })).filter(group => group.items.length > 0);
    }
    const currentCategoryTitle = filterCategories.find(c => c.key === selectedCategory)?.title;

    // --- RENDER (เหมือนเดิม แต่เพิ่มปุ่ม Back) ---
    if (loading) return <div className="order-page-container"><div>กำลังโหลด...</div></div>;

    if (editingItemId) {
        /* ... (โค้ดแสดง EditItemPage เหมือนเดิม) ... */
        const menuToEdit = menus.find(m => m.menuId === editingItemId);
        const cartItemToEdit = currentOrder[editingItemId];
        return (
            <EditItemPage 
                item={menuToEdit}
                cartItem={cartItemToEdit}
                onClose={() => setEditingItemId(null)}
                onSave={handleItemUpdate}
                onDelete={handleItemDelete}
            />
        );
    }

    if (isSummaryOpen) {
        /* ... (โค้ดแสดง OrderSummary เหมือนเดิม) ... */
        const summaryItems = Object.keys(currentOrder).map(menuId => {
            const menu = menus.find(m => m.menuId === menuId);
            const cartItem = currentOrder[menuId];
            const allNotes = [...cartItem.notes, cartItem.comment].filter(Boolean);
            return {
                id: menu.menuId, name: menu.name, quantity: cartItem.quantity,
                price: menu.price * cartItem.quantity, notes: allNotes
            };
        });
        return (
            <OrderSummary 
                items={summaryItems} totalPrice={getTotalPrice()}
                onClose={() => setIsSummaryOpen(false)}
                onConfirm={handleConfirmOrder}
                onDeleteItem={handleItemDelete}
                onEditItem={setEditingItemId}
            />
        );
    }

    return (
        <div className="order-page-container">
            {/* --- Header (แก้ไข: เพิ่มปุ่ม Back) --- */}
            <header className="order-header">
                {isSearchOpen ? (
                    <div className="search-bar-active">
                        {/* ... (โค้ด Search) ... */}
                        <input type="text" className="search-input" placeholder="ค้นหา..."
                            value={searchText} onChange={(e) => setSearchText(e.target.value)} autoFocus />
                        <button className="close-search-btn" onClick={() => { setIsSearchOpen(false); setSearchText(''); }}>✕</button>
                    </div>
                ) : (
                    <>
                        {/* 4. (ใหม่) ปุ่ม Back เพื่อกลับไปหน้าเลือกโต๊ะ */}
                        <button className="back-btn-order" onClick={() => navigate('/')}>
                            <i className="arrow-left-order"></i>
                        </button>
                        <button className="hamburger-btn-order" onClick={toggleSidebar}>
                            ☰
                        </button>
                        <div
                            className="dropdown-container"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>{currentCategoryTitle}</span>
                            <i className="arrow-down"></i>
                        </div>
                        <div 
                            className="search-icon"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <span>&#128269;</span>
                        </div>
                    </>
                )}
            </header>

            {/* ... (Dropdown, MenuList, Footer เหมือนเดิม) ... */}
            {!isSearchOpen && isDropdownOpen && (
                <div className="category-dropdown">
                    {filterCategories.map((category) => (
                        <button key={category.key}
                            className={`category-option ${selectedCategory === category.key ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category.key)}>
                            {category.title}
                        </button>
                    ))}
                </div>
            )}
            <main className="menu-list">
                {displayGroups.length > 0 ? (
                    displayGroups.map((group) => (
                        <section key={group.key} className="category-section">
                            <h2 className="category-title" id={group.title.toLowerCase()}>{group.title}</h2>
                            <div className="menu-grid">
                                {group.items.map((item) => {
                                    const quantity = currentOrder[item.menuId]?.quantity || 0;
                                    return (
                                        <MenuCard
                                            key={item.menuId}
                                            item={item}
                                            quantity={quantity}
                                            onIncrease={() => handleItemAdd(item.menuId)}
                                            onDecrease={() => handleItemRemove(item.menuId)}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    ))
                ) : (
                    <div style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                        ไม่พบเมนูที่คุณค้นหา
                    </div>
                )}
            </main>
            <footer className="order-footer">
                <button className="submit-order-btn" onClick={handleOpenSummary}>
                    <div className="qty-badge">{getTotalItemCount()}</div>
                    <span>ส่งออเดอร์ ({getTotalPrice().toLocaleString()} ฿)</span>
                </button>
            </footer>
        </div>
    );
}

export default OrderPage;


