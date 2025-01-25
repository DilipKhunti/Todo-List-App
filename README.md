# Todo List App

A simple and efficient task management app that allows you to add tasks, mark them as completed, and delete them. You can log in from any device to access your tasks anytime, anywhere.

## Features
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Cross-device accessibility with login support

## 🌐 Live Version

Check out the live version of the website: https://todo-organized.vercel.app

## Installation

### Clone the Repository
```bash
git clone https://github.com/DilipKhunti/Todo-List-App.git
cd Todo-List-App
```

### Setup Environment Variables
1. Remove `.example` from the file name `.env.example`.
2. Add your API keys in the `.env` file.

### Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

### Running the Application
#### Start Development Server
```bash
npm run dev
```

#### Start Production Server
```bash
npm run start
```

### Accessing the App
Open your browser and go to:
```
localhost:3000
```

to see the website in action.

## Directory structure
```
Directory structure:
└── dilipkhunti-todo-list-app/
    ├── README.md
    ├── LICENSE
    ├── app.js
    ├── package.json
    ├── vercel.json
    ├── .env.example
    ├── conn/
    │   └── conn.js
    ├── models/
    │   ├── task.js
    │   └── user.js
    ├── public/
    │   ├── index.html
    │   ├── log-in.html
    │   ├── sign-up.html
    │   ├── icons/
    │   ├── scripts/
    │   │   ├── config.js
    │   │   ├── index.js
    │   │   ├── log-in.js
    │   │   └── sign-up.js
    │   └── styles/
    │       └── style.css
    └── routes/
        ├── task.js
        ├── user.js
        └── userAuth.js

```

## Contributing
Feel free to contribute by submitting issues or pull requests to improve the app.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

