const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Silky POS API Documentation',
      version: '1.0.0',
      description: 'API สำหรับระบบจัดการร้านอาหาร (รองรับ Admin, Staff, Kitchen และระบบอัปโหลดรูปภาพ)',
    },
    servers: [
      {
        url: 'http://localhost:3000', // หรือ Port ที่คุณใช้
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // --- Schemas สำหรับ Request Body ---
        LoginRequest: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', example: '1234' },
          },
        },
        OrderItemRequest: {
          type: 'object',
          properties: {
            menuId: { type: 'string', example: 'R001' },
            quantity: { type: 'number', example: 1 },
            note: { type: 'string', example: 'ไม่ใส่ต้นหอม' },
          }
        },
        CreateOrderRequest: {
            type: 'object',
            properties: {
                tableId: { type: 'string', example: 'T01' },
                items: { 
                    type: 'array', 
                    items: { $ref: '#/components/schemas/OrderItemRequest' } 
                }
            }
        },
        EmployeeRequest: {
            type: 'object',
            properties: {
                employeeId: { type: 'string', example: 'E005' },
                name: { type: 'string', example: 'New Staff' },
                username: { type: 'string', example: 'newuser' },
                password: { type: 'string', example: '1234' },
                role: { type: 'string', enum: ['Admin', 'Staff', 'Kitchen'], example: 'Staff' }
            }
        }
        ,
        // Additional schemas for new/updated endpoints
        MenuMultipart: {
          type: 'object',
          properties: {
            menuId: { type: 'string', example: 'M999' },
            name: { type: 'string', example: 'ข้าวแกงกะหรี่' },
            price: { type: 'number', example: 120 },
            kitchenType: { type: 'string', enum: ['Ramen', 'Fry', 'Drink', 'Other'] },
            image: { type: 'string', format: 'binary' }
          }
        },
        TableRequest: {
          type: 'object',
          properties: {
            tableId: { type: 'string', example: 'T01' },
            seats: { type: 'number', example: 4 },
            location: { type: 'string', example: 'ชั้น 1' }
          }
        },
        PaymentRequest: {
          type: 'object',
          properties: {
            tableId: { type: 'string', example: 'T01' },
            method: { type: 'string', enum: ['Cash', 'QR'], example: 'Cash' },
            amountPaid: { type: 'number', example: 300 }
          }
        }
        ,
        // --- Response / DTO Schemas ---
        SuccessMessage: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful.' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error description' },
            error: { type: 'string', example: 'Detailed error (optional)' }
          }
        },
        TokenResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            token: { type: 'string', example: 'eyJhbGciOiJI...' },
            user: {
              type: 'object',
              properties: {
                username: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        },
        Menu: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            menuId: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            kitchenType: { type: 'string' },
            imageUrl: { type: 'string' },
            isAvailable: { type: 'boolean' }
          }
        },
        MenuListResponse: {
          type: 'array',
          items: { $ref: '#/components/schemas/Menu' }
        },
        Table: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            tableId: { type: 'string' },
            seats: { type: 'number' },
            status: { type: 'string' },
            currentOrderIds: { type: 'array', items: { type: 'string' } }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            tableId: { type: 'string' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            paymentId: { type: 'string' }
          }
        },
        OrderList: {
          type: 'array',
          items: { $ref: '#/components/schemas/Order' }
        },
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderIds: { type: 'array', items: { type: 'string' } },
            method: { type: 'string' },
            amountPaid: { type: 'number' }
          }
        }
      },
    },
    paths: {
      // =======================
      // 🔐 AUTHENTICATION
      // =======================
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'เข้าสู่ระบบ (Login)',
          description: 'ใช้ Username/Password เพื่อรับ Token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Login สำเร็จ (ได้รับ Token)', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          },
        },
      },

      // =======================
      // 🛡️ ADMIN API
      // =======================
      '/api/admin/stats': {
        get: {
          tags: ['Admin - Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'ดูภาพรวมยอดขายและสถานะร้าน (Dashboard Stats)',
          responses: { 200: { description: 'Success' } },
        },
      },
      '/api/admin/sales/top-menu': {
        get: {
          tags: ['Admin - Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'รายงานเมนูขายดี (Top Selling)',
          parameters: [
            { in: 'query', name: 'period', schema: { type: 'string', enum: ['วันนี้', 'สัปดาห์นี้', 'เดือนนี้', 'ทั้งหมด'] } },
            { in: 'query', name: 'sort', schema: { type: 'string', enum: ['qty', 'revenue'], default: 'qty' } }
          ],
          responses: { 200: { description: 'รายการเมนูขายดี' } },
        },
      },
      '/api/admin/menus': {
        get: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'ดึงรายการเมนูทั้งหมด',
          responses: { 200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuListResponse' } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
        post: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'สร้างเมนูใหม่ (รองรับอัปโหลดรูปภาพ)',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    menuId: { type: 'string', example: 'M999' },
                    name: { type: 'string', example: 'ข้าวแกงกะหรี่' },
                    price: { type: 'number', example: 120 },
                    kitchenType: { type: 'string', enum: ['Ramen', 'Fry', 'Drink', 'Other'] },
                    image: { type: 'string', format: 'binary' }
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Menu Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
      },
      '/api/admin/menus/{menuId}': {
        put: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'แก้ไขเมนู',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                    image: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Updated' } }
        },
        delete: {
            tags: ['Admin - Menus'],
            security: [{ bearerAuth: [] }],
            summary: 'ลบเมนู',
            parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Deleted' } }
        }
      },
        '/api/admin/employees': {
          get: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'ดูรายชื่อพนักงานทั้งหมด',
            responses: { 200: { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          },
          post: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'เพิ่มพนักงานใหม่',
              requestBody: {
                  content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeRequest' } } }
              },
            responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          }
      },
        '/api/admin/employees/{id}': {
          put: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'แก้ไขข้อมูลพนักงาน',
              parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
              requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeRequest' } } } },
            responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          },
          delete: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'ลบพนักงาน',
              parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          }
      },
      // Admin - Tables
      '/api/admin/tables': {
        get: {
          tags: ['Admin - Tables'],
          security: [{ bearerAuth: [] }],
          summary: 'ดูรายการโต๊ะทั้งหมด',
          responses: { 200: { description: 'List of tables', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Table' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        },
        post: {
          tags: ['Admin - Tables'],
          security: [{ bearerAuth: [] }],
          summary: 'สร้างโต๊ะใหม่',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TableRequest' } } } },
          responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Table' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/admin/tables/{id}': {
        delete: {
          tags: ['Admin - Tables'],
          security: [{ bearerAuth: [] }],
          summary: 'ลบโต๊ะ (Admin)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      // Admin - Menu GET by id (document GET as well as existing PUT/DELETE)
      '/api/admin/menus/{menuId}': {
        get: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'ดูเมนูตาม ID (Admin)',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        },
        put: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'แก้ไขเมนู',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: { $ref: '#/components/schemas/MenuMultipart' }
              }
            }
          },
          responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        },
        delete: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'ลบเมนู',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      // Staff - Menus (for ordering)
      '/api/staff/menus': {
        get: {
          tags: ['Staff - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'ดึงรายการเมนูสำหรับหน้ารับออเดอร์',
          responses: { 200: { description: 'List of menus', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuListResponse' } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/staff/menus/{menuId}': {
        get: {
          tags: ['Staff - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'ดูรายละเอียดเมนู (สำหรับ Staff)',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Menu details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },

      // =======================
      // 🧑‍🍳 STAFF API
      // =======================
      '/api/staff/tables': {
        get: {
          tags: ['Staff - Main'],
          security: [{ bearerAuth: [] }],
          summary: 'ดูสถานะโต๊ะทั้งหมด',
          responses: { 200: { description: 'List of tables', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Table' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        }
      },
      '/api/staff/tables/{tableId}/bill': {
        get: {
          tags: ['Staff - Main'],
          security: [{ bearerAuth: [] }],
          summary: 'ดูบิลปัจจุบันของโต๊ะ (Check Bill)',
          parameters: [{ in: 'path', name: 'tableId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Bill details', content: { 'application/json': { schema: { type: 'object' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        }
      },
      '/api/staff/orders': {
        post: {
          tags: ['Staff - Orders'],
          security: [{ bearerAuth: [] }],
          summary: 'เปิดบิล / สั่งอาหารเพิ่ม',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } } },
          },
          responses: { 201: { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
      },
      '/api/staff/orders/item/{itemId}': {
        delete: {
          tags: ['Staff - Orders'],
          security: [{ bearerAuth: [] }],
          summary: 'ยกเลิกรายการอาหาร (Cancel Item)',
          parameters: [{ in: 'path', name: 'itemId', required: true, description: 'ID ของ OrderItem', schema: { type: 'string' } }],
          responses: { 200: { description: 'Item Cancelled', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
      },
      '/api/staff/payments': {
        post: {
            tags: ['Staff - Payment'],
            security: [{ bearerAuth: [] }],
            summary: 'ชำระเงิน (เช็คบิล)',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                tableId: { type: 'string', example: 'T01' },
                                method: { type: 'string', enum: ['Cash', 'QR'] },
                                amountPaid: { type: 'number' }
                            }
                        }
                    }
                }
            },
            responses: { 201: { description: 'Payment successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/Payment' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/staff/history/paid-orders': {
          get: {
              tags: ['Staff - History'],
              security: [{ bearerAuth: [] }],
              summary: 'ดูประวัติบิลที่จ่ายแล้วของวันนี้',
            responses: { 200: { description: 'List of paid orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          }
      },

      // =======================
      // 🍳 KITCHEN API
      // =======================
      '/api/kitchen/orders/{kitchenType}': {
        get: {
          tags: ['Kitchen'],
          security: [{ bearerAuth: [] }],
          summary: 'ดึงรายการอาหารที่ต้องทำ (Pending Only)',
          parameters: [
            { in: 'path', name: 'kitchenType', required: true, schema: { type: 'string', enum: ['Ramen', 'Fry', 'Drink'] } }
          ],
          responses: { 200: { description: 'List of pending items', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, items: { type: 'array', items: { type: 'object' } } } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
      },
      '/api/kitchen/item/{itemId}/toggle': {
        post: {
            tags: ['Kitchen'],
            security: [{ bearerAuth: [] }],
            summary: 'เปลี่ยนสถานะอาหาร (ทำเสร็จแล้ว/ยังไม่เสร็จ)',
            parameters: [{ in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Status toggled', content: { 'application/json': { schema: { type: 'object' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/kitchen/order/{orderId}/served': {
        post: {
            tags: ['Kitchen'],
            security: [{ bearerAuth: [] }],
            summary: 'เสิร์ฟครบทุกอย่าง (ปิดงานโต๊ะนี้)',
            parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Order Served', content: { 'application/json': { schema: { type: 'object' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/kitchen/order/{orderId}/undo': {
        post: {
            tags: ['Kitchen'],
            security: [{ bearerAuth: [] }],
            summary: 'ย้อนกลับสถานะ Served -> Ready (Undo)',
            parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Undone successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      }
    },
  },
  apis: [], // ไม่ได้ใช้ comment ในไฟล์ แต่ config ไว้ตรงนี้โดยตรง
};

module.exports = swaggerJsdoc(options);