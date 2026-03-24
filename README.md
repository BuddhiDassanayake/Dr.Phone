# 📱 Dr.Phone — Mobile Phone Repair Tracking System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

Dr.Phone is a comprehensive full-stack web application designed for mobile phone repair shops. It streamlines the workflow between technicians and customers, allowing shop owners to manage repairs and enabling customers to track their device's repair status in real-time. 

To enhance customer experience, Dr.Phone includes an integrated **AI Chatbot** powered by Google's Gemini API, capable of answering customer queries and looking up repair statuses automatically.

## ✨ Key Features

- ** Real-Time Repair Tracking:** Customers can enter their unique Tracking ID to instantly view the status of their repair (Pending, Ongoing, or Completed).
- ** AI Customer Support Chatbot:** Integrated with Gemini 2.5 Flash, the smart chatbot can answer general repair questions, look up tracking IDs by customer name, and provide estimated completion times.
- ** Admin Dashboard:** A secure backend for shop owners to add new repairs, generate tracking IDs, and update repair statuses.
- ** Automated CI/CD Pipeline:** Fully automated deployment using GitHub Webhooks. Every push to the main branch automatically pulls and restarts the server on an AWS EC2 instance.

## 🛠️ Tech Stack

**Frontend:**
* React.js (JSX)
* Vite
* CSS / Tailwind (or your styling method)

**Backend:**
* Node.js & Express.js
* SQLite (better-sqlite3)
* Google Generative AI SDK (Gemini)

**DevOps & Hosting:**
* Amazon Web Services (AWS EC2)
* GitHub Webhooks (CI/CD automation)
* PM2 (Process Manager for Node.js)

## 📸 Screenshots

*(Replace these placeholder links with actual screenshots of your application!)*

| Customer Tracking Page | AI Chatbot in Action |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250.png?text=Add+Tracking+Screenshot+Here" width="400"/> | <img src="https://via.placeholder.com/400x250.png?text=Add+Chatbot+Screenshot+Here" width="400"/> |

## ⚙️ Local Installation & Setup

Follow these steps to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/BudhiDassanayake/dr-phone.git
cd dr-phone