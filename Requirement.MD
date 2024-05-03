# Inventory Management

<p>I am Askur Rahman. I have a import business.I want to Inventory software for my business world wide. Now I need to inventory software for my business.</p>

# SRS Software Requirement Specification

#### Project Name: Inventory Management

### Introduction:

<p>
    The Inventory Management Rest API is collection of import api endpoints. admin and user can count and posting Inventory they want to need, manage and interact with an every single user to our application. The backend application provides authentication functionality, allows user review and view all product, buy to any quantity. This article outline the functional and non-functional requirements for the development of the Inventory Management REST API Application.
</p>

### Project Overview

<p>
    The REST API application aims to provide a seamless user experience while ensuring the security and integrity of user data.  It allows users to browse any kind of product without authentication but authentication is require for buying and provide review. Admin must be control any product and inventory form a role base admin dashboard

</p>

### Functional Requirement:

##### Authentication

- [x] Users should be able to register for an account by providing their email address, name and a secure password.
- [x] Users Should be able to log in securely using their email address and password.
- [x] Administrators should be able to login securely using their credentials.

##### User Management

- [x] Admin can create new users
- [x] Admin can see a list of all user
- [x] Admin can update or delete users
- [x] Admin can change password any user
- [x] Authenticated user can buy and add to cart any product, cancel order in a certain time.
- [x] Authenticated user can see their present condition of there order.
- [x] Authenticated user can update their profile.
- [x] Admin create a new product manage inventory
- [ ] Admin can cancel any product order

##### Guest User Management

- [x] Unauthenticated User can added any product in cart
- [ ] See all product
- [ ] See all review and ratting

##### User Photo Management:

- [x] Authenticated user should be upload their user image.
- [x] Only one photo upload user for avatar image.

##### Product Management

- [x] Permitted Admin can create a product
- [x] Admin can Edit Product Info
- [x] Admin can provide Product discount

##### Inventory Management

- [x] Admin can add new product inventory
- [x] Admin can Remove or delete any product quantity in inventory
- [x] Inventory can manage stock

##### Email service or message

- [x] User can complete any order system can automatically send email or message.
- [x] User can complete any product order. admin get a message how many product quantity is exist in this moment.

### Non-Functional Requirement

##### Security

User password must be securely stored using appropriate hashing and salting techniques.
ApI endpoints handling sensitive information should be protected using secure protocol (HTTPS).
Authentication tokens should be securely generated and validated to prevent unauthorized access.

##### Performance

The API should be able to handle a high volume of concurrent request efficiently.
Response time should be optimized to ensure a responsive user experience.

##### Scalability.

The application should be designed a to accommodate future growth and increasing user demands.
The architecture should allow for horizontal scalability , such as load balancing and distributed process.

##### Reliability

The API should be highly available, minimizing downtime and ensuring data integrity.
Error handling and logging should be implemented to facilitate troubleshooting and maintenance.

### Constraints

This REST API Application should be implemented using a specific programming language or framework.
The API may depend on external service of libraries for certain functionalities

### User Interface

Rest API Application does not include a user interface. It solely provides a back-end API for integration with front-end application or clients.
