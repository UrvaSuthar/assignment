# **Role-Based Access Control System**

This is a dynamic and interactive role-based access control system built with Angular and NG-ZORRO to ensure a polished user experience. It allows seamless management of users, roles, and permissions while enforcing secure role-based access controls.  

The system also includes a playful **"Hire Me" feature** designed specifically for recruiters, making it fun and engaging while showcasing my resume.

---

## **Features**

### **Admin Panel**
- **User Management**: Easily create, update, or delete users and assign them roles.
- **Role Management**: Define roles and their permissions dynamically.
  - Key roles like **"Recruiter"** are protected to prevent accidental edits or deletions.
- **Permission Management**: Manage what actions each role can perform.
- **Dynamic Access Control**: Access to features is tailored to the user’s role and permissions.

### **Recruiter Section**
- **Fun Interaction**: Recruiters experience a gamified "Hire Me" page that’s engaging and unique.
- **Resume Showcase**: My resume is displayed dynamically for recruiters who meet the access criteria.
- **Hire Button**: The "Hire Me" button is activated only for recruiters with the **"HireMe"** permission.

### **User-Friendly Interface**
- Built with **NG-ZORRO** for a clean, professional, and responsive design.
- Rounded corners, smooth transitions, and interactive feedback make the experience polished and approachable.

---

## **How It Works**

### **Admin Panel**:
Admins can log in to manage:
1. **Users**: Add or edit user details and roles.
2. **Roles**: Assign permissions, keeping critical roles like "Recruiter" safe from modification.
3. **Permissions**: Define actions that roles can perform, ensuring flexibility and control.

### **User Page**:
1. **Log In**: Users access the system using their assigned credentials.
2. **Resume Display**: If they have the "Recruiter" role, they can view my resume.
3. **Hire Me Button**: If they have the **"HireMe"** permission, they can click the button to take action!
4. **Comments**: If they have the **"read" & "write"** permission, they can read and comment on my resume
---

## **AuthGuard – Keeping It Secure**

The **AuthGuard** is the backbone of this system, ensuring only the right people access the right pages.

- **Token Validation**: Checks the user's token before granting access.
- **Active User Check**: Ensures the user has the active account status to login.
- **Dynamic Protection**: If a user doesn’t meet the required criteria, they are redirected to a safe page (like the login screen).

---

## **Getting Started**

### **Prerequisites**
1. Install [Node.js](https://nodejs.org/).
2. Install [Angular CLI](https://angular.io/cli).
3. Install [JSON Server](https://github.com/typicode/json-server) for mock data.

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/UrvaSuthar/assignment.git
   ```
2. Navigate to the project folder:
   ```bash
   cd assignment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the mock server:
   ```bash
   json-server --watch db.json
   ```
5. Launch the Angular app:
   ```bash
   ng serve
   ```
6. Open [http://localhost:4200](http://localhost:4200) in your browser to get started.

---

## **Database Overview**

Here’s a sample of how the data is structured:

### **Users**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "roleId": 2
}
```

### **Roles**
```json
{
  "id": 2,
  "name": "Recruiter",
  "permissions": [1, 2],
  "isProtected": true
}
```

### **Permissions**
```json
{
  "id": 1,
  "name": "HireMe",
  "isProtected": true
}
```

---

## **Protected Roles**

Some roles, like **"Recruiter"**, are marked as **protected** in the database:
- These roles cannot be edited or deleted, ensuring that critical functionalities tied to these roles remain intact.

---

## **Playful Recruiter Journey**

Imagine this:  
A recruiter logs in and finds themselves in a fun interface. They’re encouraged to interact with the "Hire Me" feature, which checks their role and permissions. Once they meet the criteria, they can see my resume and even click the **"Hire Me"** button to take action.

This lighthearted approach adds a personal touch while demonstrating creativity and technical expertise.

---

## **Technologies Used**
- **Frontend**: Angular with NG-ZORRO for UI components.
- **Backend**: JSON Server for quick mock API setup.
- **Styling**: Custom CSS enhanced with NG-ZORRO elements.
- **Form Handling**: Reactive Forms for flexibility and validation.

---
