/**
 * swagger.js - API documentation configuration
 * * Generates OpenAPI/Swagger documentation for the Hotel Reservation API.
 * * Features:
 * - Auto-generated API documentation
 * - Interactive API testing
 * - Request/Response schemas
 * - Authentication documentation
 * * Dependencies:
 * - swagger-jsdoc: Parse JSDoc comments
 * - swagger-ui-express: Serve Swagger UI
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hotel Reservation System API',
    version: '1.0.0',
    description: `
# Hotel Reservation System API Documentation

This API provides complete functionality for managing a hotel reservation system.

## Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Guest Management**: CRUD operations for hotel guests
- **Room Management**: Manage room inventory and availability
- **Reservation System**: Book, modify, and cancel reservations
- **Payment Processing**: Handle payments and refunds
- **Reporting**: Generate daily, weekly, and monthly reports
- **Audit Logging**: Track all system changes

## Authentication
All endpoints (except auth/login and auth/register) require a JWT token.
Include the token in the Authorization header: \`Authorization: Bearer <token>\`

## Roles & Permissions
- **Admin**: Full system access
- **Receptionist**: Manage guests, reservations, payments, view reports
- **Guest**: View own profile, make reservations, view own reservations

## Error Responses
All errors follow a consistent format:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional array of validation errors
}
\`\`\`

## Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Authentication: 5 attempts per hour per IP
    `,
    contact: {
      name: 'API Support',
      email: 'support@hotel.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'https://api.hotel-reservation.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message description',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          user_id: { type: 'integer', example: 1 },
          email: { type: 'string', example: 'user@example.com' },
          role: { type: 'string', example: 'admin' },
          is_active: { type: 'boolean', example: true },
          last_login: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Guest: {
        type: 'object',
        properties: {
          guest_id: { type: 'integer', example: 1 },
          first_name: { type: 'string', example: 'John' },
          last_name: { type: 'string', example: 'Doe' },
          email: { type: 'string', example: 'john@example.com' },
          phone: { type: 'string', example: '+1234567890' },
          address: { type: 'string', example: '123 Main St' },
          guest_type: { type: 'string', enum: ['online', 'walk-in'], example: 'walk-in' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Room: {
        type: 'object',
        properties: {
          room_id: { type: 'integer', example: 1 },
          room_number: { type: 'string', example: '101' },
          floor: { type: 'integer', example: 1 },
          status: { 
            type: 'string', 
            enum: ['available', 'occupied', 'maintenance', 'cleaning'],
            example: 'available'
          },
          type_name: { type: 'string', example: 'Standard Room' },
          base_price: { type: 'number', format: 'float', example: 100.00 },
          max_occupancy: { type: 'integer', example: 2 },
        },
      },
      Reservation: {
        type: 'object',
        properties: {
          reservation_id: { type: 'integer', example: 1 },
          guest_name: { type: 'string', example: 'John Doe' },
          room_number: { type: 'string', example: '101' },
          check_in_date: { type: 'string', format: 'date', example: '2024-03-01' },
          check_out_date: { type: 'string', format: 'date', example: '2024-03-05' },
          status: {
            type: 'string',
            enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
            example: 'confirmed',
          },
          total_amount: { type: 'number', format: 'float', example: 400.00 },
          number_of_guests: { type: 'integer', example: 2 },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 5 },
          hasNext: { type: 'boolean', example: true },
          hasPrev: { type: 'boolean', example: false },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Access denied. No token provided.',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Validation Error',
              errors: [
                { field: 'email', message: 'Valid email is required' },
                { field: 'password', message: 'Password must be at least 8 characters' },
              ],
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Guest not found',
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js', // Route files with JSDoc comments
    './src/controllers/*.js', // Controller files
    './src/models/*.js', // Model files
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Swagger UI setup
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Hotel Reservation API Documentation',
  customfavIcon: '/favicon.ico',
};

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app) => {
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  
  // Serve Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('📚 API Documentation available at: http://localhost:5000/api-docs');
};

export default setupSwagger;