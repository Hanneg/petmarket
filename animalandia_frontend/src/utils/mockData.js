// Lista provisional de productos
export const mockProducts = [
    {
        id: 1,
        name: "Comida Premiun para Perros",
        price: 25.99,
        category: "Comida",
        image: "/src//assets/images/categoria_perros.jpg",
        description: "Alimento húmedo balanceado para perros estilizados"
    },
    {
        id: 2,
        name: "Rascador para Gatos Deluxe",
        price: 68.70,
        category: "Accesorios",
        image: "/src/assets/images/categoria_gato.jpg",
        description: "Rascador en forma de asiento para gatos pequeños"
    },
    {
        id: 3,
        name: "Collar ajustable para perros",
        price: 12.50,
        category: "Accesorios",
        image: "/src/assets/images/categoria_accesorios.jpg",
        description: "Collar de nylon resistente, ajustable y cómodo"
    },
    {
        id: 4,
        name: "Arena sanitaria para gatos de 8kg",
        price: 100.50,
        category: "Salud e higiene",
        image: "/src/assets/images/categoria_comida.jpg",
        description: "Arena absorbente y libre de olores para gatos"
    },
    {
        id: 5,
        name: "Cama para mascotas mediana",
        price: 150.60,
        category: "Accesorios",
        image: "/src/assets/images/categoria_accesorios.jpg",
        description: "Cama acolchada suave para mascotas pequeñas"
    }
]

// Pedidos simulados
export const mockOrders = [
  {
    id: 101,
    date: "2025-11-02",
    total: 251.10,
    status: "Completado",
    items: [
      { name: "Cama para mascotas mediana", quantity: 2, price: 301.20 },
      { name: "Arena sanitaria para gatos de 8kg", quantity: 1, price: 100.50 }
    ],
  },
  {
    id: 102,
    date: "2025-11-04",
    total: 28.5,
    status: "Pendiente",
    items: [
      { name: "Collar ajustable para perros", quantity: 1, price: 12.50 },
      { name: "Rascador para Gatos Deluxe", quantity: 2, price: 137.40 }
    ]
  },
];

export const getMockOrders = () => mockOrders;