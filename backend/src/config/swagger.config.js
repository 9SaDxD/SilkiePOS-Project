const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Silky POS API Documentation',
      version: '1.0.0',
      description: 'API เธชเธณเธซเธฃเธฑเธเธฃเธฐเธเธเธเธฑเธ”เธเธฒเธฃเธฃเนเธฒเธเธญเธฒเธซเธฒเธฃ (เธฃเธญเธเธฃเธฑเธ Admin, Staff, Kitchen เนเธฅเธฐเธฃเธฐเธเธเธญเธฑเธเนเธซเธฅเธ”เธฃเธนเธเธ เธฒเธ)',
    },
    servers: [
      {
        url: 'https://silkiepos-project.onrender.com', // เธซเธฃเธทเธญ Port เธ—เธตเนเธเธธเธ“เนเธเน
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
        // --- Schemas เธชเธณเธซเธฃเธฑเธ Request Body ---
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
            note: { type: 'string', example: 'เนเธกเนเนเธชเนเธ•เนเธเธซเธญเธก' },
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
            name: { type: 'string', example: 'เธเนเธฒเธงเนเธเธเธเธฐเธซเธฃเธตเน' },
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
            location: { type: 'string', example: 'เธเธฑเนเธ 1' }
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
      // ๐” AUTHENTICATION
      // =======================
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'เน€เธเนเธฒเธชเธนเนเธฃเธฐเธเธ (Login)',
          description: 'เนเธเน Username/Password เน€เธเธทเนเธญเธฃเธฑเธ Token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Login เธชเธณเน€เธฃเนเธ (เนเธ”เนเธฃเธฑเธ Token)', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          },
        },
      },

      // =======================
      // ๐ก๏ธ ADMIN API
      // =======================
      '/api/admin/stats': {
        get: {
          tags: ['Admin - Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธนเธ เธฒเธเธฃเธงเธกเธขเธญเธ”เธเธฒเธขเนเธฅเธฐเธชเธ–เธฒเธเธฐเธฃเนเธฒเธ (Dashboard Stats)',
          responses: { 200: { description: 'Success' } },
        },
      },
      '/api/admin/sales/top-menu': {
        get: {
          tags: ['Admin - Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'เธฃเธฒเธขเธเธฒเธเน€เธกเธเธนเธเธฒเธขเธ”เธต (Top Selling)',
          parameters: [
            { in: 'query', name: 'period', schema: { type: 'string', enum: ['เธงเธฑเธเธเธตเน', 'เธชเธฑเธเธ”เธฒเธซเนเธเธตเน', 'เน€เธ”เธทเธญเธเธเธตเน', 'เธ—เธฑเนเธเธซเธกเธ”'] } },
            { in: 'query', name: 'sort', schema: { type: 'string', enum: ['qty', 'revenue'], default: 'qty' } }
          ],
          responses: { 200: { description: 'เธฃเธฒเธขเธเธฒเธฃเน€เธกเธเธนเธเธฒเธขเธ”เธต' } },
        },
      },
      '/api/admin/menus': {
        get: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธถเธเธฃเธฒเธขเธเธฒเธฃเน€เธกเธเธนเธ—เธฑเนเธเธซเธกเธ”',
          responses: { 200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuListResponse' } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
        post: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'เธชเธฃเนเธฒเธเน€เธกเธเธนเนเธซเธกเน (เธฃเธญเธเธฃเธฑเธเธญเธฑเธเนเธซเธฅเธ”เธฃเธนเธเธ เธฒเธ)',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    menuId: { type: 'string', example: 'M999' },
                    name: { type: 'string', example: 'เธเนเธฒเธงเนเธเธเธเธฐเธซเธฃเธตเน' },
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
          summary: 'เนเธเนเนเธเน€เธกเธเธน',
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
            summary: 'เธฅเธเน€เธกเธเธน',
            parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Deleted' } }
        }
      },
        '/api/admin/employees': {
          get: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'เธ”เธนเธฃเธฒเธขเธเธทเนเธญเธเธเธฑเธเธเธฒเธเธ—เธฑเนเธเธซเธกเธ”',
            responses: { 200: { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          },
          post: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'เน€เธเธดเนเธกเธเธเธฑเธเธเธฒเธเนเธซเธกเน',
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
              summary: 'เนเธเนเนเธเธเนเธญเธกเธนเธฅเธเธเธฑเธเธเธฒเธ',
              parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
              requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeRequest' } } } },
            responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          },
          delete: {
              tags: ['Admin - Employees'],
              security: [{ bearerAuth: [] }],
              summary: 'เธฅเธเธเธเธฑเธเธเธฒเธ',
              parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          }
      },
      // Admin - Tables
      '/api/admin/tables': {
        get: {
          tags: ['Admin - Tables'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธนเธฃเธฒเธขเธเธฒเธฃเนเธ•เนเธฐเธ—เธฑเนเธเธซเธกเธ”',
          responses: { 200: { description: 'List of tables', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Table' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        },
        post: {
          tags: ['Admin - Tables'],
          security: [{ bearerAuth: [] }],
          summary: 'เธชเธฃเนเธฒเธเนเธ•เนเธฐเนเธซเธกเน',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TableRequest' } } } },
          responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Table' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/admin/tables/{id}': {
        delete: {
          tags: ['Admin - Tables'],
          security: [{ bearerAuth: [] }],
          summary: 'เธฅเธเนเธ•เนเธฐ (Admin)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      // Admin - Menu GET by id (document GET as well as existing PUT/DELETE)
      '/api/admin/menus/{menuId}': {
        get: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธนเน€เธกเธเธนเธ•เธฒเธก ID (Admin)',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        },
        put: {
          tags: ['Admin - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'เนเธเนเนเธเน€เธกเธเธน',
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
          summary: 'เธฅเธเน€เธกเธเธน',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      // Staff - Menus (for ordering)
      '/api/staff/menus': {
        get: {
          tags: ['Staff - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธถเธเธฃเธฒเธขเธเธฒเธฃเน€เธกเธเธนเธชเธณเธซเธฃเธฑเธเธซเธเนเธฒเธฃเธฑเธเธญเธญเน€เธ”เธญเธฃเน',
          responses: { 200: { description: 'List of menus', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuListResponse' } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/staff/menus/{menuId}': {
        get: {
          tags: ['Staff - Menus'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธนเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เน€เธกเธเธน (เธชเธณเธซเธฃเธฑเธ Staff)',
          parameters: [{ in: 'path', name: 'menuId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Menu details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },

      // =======================
      // ๐ง‘โ€๐ณ STAFF API
      // =======================
      '/api/staff/tables': {
        get: {
          tags: ['Staff - Main'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธนเธชเธ–เธฒเธเธฐเนเธ•เนเธฐเธ—เธฑเนเธเธซเธกเธ”',
          responses: { 200: { description: 'List of tables', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Table' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        }
      },
      '/api/staff/tables/{tableId}/bill': {
        get: {
          tags: ['Staff - Main'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธนเธเธดเธฅเธเธฑเธเธเธธเธเธฑเธเธเธญเธเนเธ•เนเธฐ (Check Bill)',
          parameters: [{ in: 'path', name: 'tableId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Bill details', content: { 'application/json': { schema: { type: 'object' } } } }, 404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        }
      },
      '/api/staff/orders': {
        post: {
          tags: ['Staff - Orders'],
          security: [{ bearerAuth: [] }],
          summary: 'เน€เธเธดเธ”เธเธดเธฅ / เธชเธฑเนเธเธญเธฒเธซเธฒเธฃเน€เธเธดเนเธก',
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
          summary: 'เธขเธเน€เธฅเธดเธเธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃ (Cancel Item)',
          parameters: [{ in: 'path', name: 'itemId', required: true, description: 'ID เธเธญเธ OrderItem', schema: { type: 'string' } }],
          responses: { 200: { description: 'Item Cancelled', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } },
        },
      },
      '/api/staff/payments': {
        post: {
            tags: ['Staff - Payment'],
            security: [{ bearerAuth: [] }],
            summary: 'เธเธณเธฃเธฐเน€เธเธดเธ (เน€เธเนเธเธเธดเธฅ)',
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
              summary: 'เธ”เธนเธเธฃเธฐเธงเธฑเธ•เธดเธเธดเธฅเธ—เธตเนเธเนเธฒเธขเนเธฅเนเธงเธเธญเธเธงเธฑเธเธเธตเน',
            responses: { 200: { description: 'List of paid orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } } } } }, 500: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
          }
      },

      // =======================
      // ๐ณ KITCHEN API
      // =======================
      '/api/kitchen/orders/{kitchenType}': {
        get: {
          tags: ['Kitchen'],
          security: [{ bearerAuth: [] }],
          summary: 'เธ”เธถเธเธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃเธ—เธตเนเธ•เนเธญเธเธ—เธณ (Pending Only)',
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
            summary: 'เน€เธเธฅเธตเนเธขเธเธชเธ–เธฒเธเธฐเธญเธฒเธซเธฒเธฃ (เธ—เธณเน€เธชเธฃเนเธเนเธฅเนเธง/เธขเธฑเธเนเธกเนเน€เธชเธฃเนเธ)',
            parameters: [{ in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Status toggled', content: { 'application/json': { schema: { type: 'object' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/kitchen/order/{orderId}/served': {
        post: {
            tags: ['Kitchen'],
            security: [{ bearerAuth: [] }],
            summary: 'เน€เธชเธดเธฃเนเธเธเธฃเธเธ—เธธเธเธญเธขเนเธฒเธ (เธเธดเธ”เธเธฒเธเนเธ•เนเธฐเธเธตเน)',
            parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Order Served', content: { 'application/json': { schema: { type: 'object' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      },
      '/api/kitchen/order/{orderId}/undo': {
        post: {
            tags: ['Kitchen'],
            security: [{ bearerAuth: [] }],
            summary: 'เธขเนเธญเธเธเธฅเธฑเธเธชเธ–เธฒเธเธฐ Served -> Ready (Undo)',
            parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Undone successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }, 400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } }
        }
      }
    },
  },
  apis: [], // เนเธกเนเนเธ”เนเนเธเน comment เนเธเนเธเธฅเน เนเธ•เน config เนเธงเนเธ•เธฃเธเธเธตเนเนเธ”เธขเธ•เธฃเธ
};

module.exports = swaggerJsdoc(options);


