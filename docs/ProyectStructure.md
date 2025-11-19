## Estructura del Proyecto

/Seeds-to-Roots
│
├── frontend/              # Todo lo de la Entrega 1
│   ├── client/            
│   │   ├── pages/
│   │   ├── js/
│   │   ├── css/
│   │   └── components
│   ├── admin/
│   │   ├── pages/
│   │   ├── js/
│   │   ├── css/
│   │   └── components
│   └── api/   
│       └── mockData/
│  
├── backend/               # API, lógica y conexión a BD (Entrega 2+)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/        # Representación de tablas
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   └── utils/
│   ├── tests/
│   └── package.json
│
├── database/
│   ├── schema.sql         # Creación de tablas
│   ├── seed.sql           # Datos iniciales (opcional)
│   └── diagrams/          # DER y diagramas
│
└── docs/                  # Documentación, entregas, actas, etc
    ├── entrega1.md
    ├── entrega2.md
    ├── entrega3.md
    └── readme.md