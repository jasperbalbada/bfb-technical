# bfb-technical

# Overview

This project simulates a platform where users can:

1. Log in using predefined credentials.
2. View available Inspection Reports or Products.
3. Download purchased Products after verification.

# Key Features:

- User Login: Basic authentication simulating user login functionality.
- View Products: Users can see available mock products after logging in.
- Purchase Validation: Users can download purchased products, but will first need to verify their identity using a 6-digit code sent upon initiating the download.

# Things to Note

- Mock Data: The application uses mock data for Users, Products, and Orders. This mock data is designed to simulate real interactions with a database.
- Basic Authentication: The login functionality here is basic and is only for the purpose of demonstrating user authentication. It is assumed that a more advanced authentication system would be implemented in a production environment.

# Nice-to-Have Features

- Email/SMS Code Delivery: Ideally, the 6-digit verification code should be sent via email or SMS to the user for better security and user experience.
- Test Code: Implementing test code would help ensure the reliability and stability of the platform.

# How to Run the Project

1. Install dependencies:
 - npm install
2. Start the development server:
 - npm run dev
3. The application will be served at: http://localhost:3000/

# How to Test the Application

1. On the login page, use one of the following credentials:
  Emails:
   - jasperbalbada@gmail.com
   - solanarowe@gmail.com
   - agathaharkness@gmail.com
  Password: password
2. After successful login, you will be redirected to the Products page, which displays all available mock products.
3. If the user has purchased a product, they will be able to download the associated file. If a purchase hasn't been made, the download option will not be available.
4. When clicking "Download File," the user will be taken to the verification page, where a 6-digit code is displayed.
5. The 6-digit code can only be used for 10 minutes. After entering the code successfully, the user will be redirected to their file for download.

# Future Enhancements

- Improved Authentication: Replace mock authentication with a more secure system.
- Enhanced Security: Implement time-sensitive links and user restrictions for file downloads.