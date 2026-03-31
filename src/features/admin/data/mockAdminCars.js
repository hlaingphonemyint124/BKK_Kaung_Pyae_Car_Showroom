const mockAdminCars = [
  {
    id: "buy-1",
    type: "buy",
    name: "Honda Civic",
    brand: "Honda",
    year: 2024,
    mileage: 12000,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    specs: {
      fuel: "Petrol",
      transmission: "Manual",
      color: "White",
      seats: 4,
      plate: "123456",
      mpg: "30 MPG",
    },
    buy: {
      price: 999999,
      currency: "THB",
      documents: "Ready to transfer",
    },
    rental: null,
    status: {
      isAvailable: true,
      isMostRented: false,
    },
  },
  {
    id: "buy-2",
    type: "buy",
    name: "Toyota Yaris",
    brand: "Toyota",
    year: 2023,
    mileage: 20000,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    specs: {
      fuel: "Petrol",
      transmission: "Auto",
      color: "White",
      seats: 4,
      plate: "550116",
      mpg: "28 MPG",
    },
    buy: {
      price: 900110,
      currency: "THB",
      documents: "Ready to transfer",
    },
    rental: null,
    status: {
      isAvailable: true,
      isMostRented: false,
    },
  },
  {
    id: "buy-3",
    type: "buy",
    name: "Toyota Fortuner",
    brand: "Toyota",
    year: 2021,
    mileage: 45000,
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    specs: {
      fuel: "Petrol",
      transmission: "Auto",
      color: "White",
      seats: 7,
      plate: "778899",
      mpg: "26 MPG",
    },
    buy: {
      price: 780000,
      currency: "THB",
      documents: "Ready to transfer",
    },
    rental: null,
    status: {
      isAvailable: false,
      isMostRented: true,
    },
  },
  {
    id: "rent-1",
    type: "rental",
    name: "Toyota Fortuner",
    brand: "Toyota",
    year: 2019,
    mileage: 70000,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    specs: {
      fuel: "Petrol",
      transmission: "Auto",
      color: "White",
      seats: 5,
      plate: "123000",
      mpg: "22 MPG",
    },
    buy: null,
    rental: {
      pricePerDay: 780,
      price7Days: 5300,
      price30Days: 21000,
      terms: "Please read Term and Conditions",
    },
    status: {
      isAvailable: true,
      isMostRented: true,
    },
  },
  {
    id: "rent-2",
    type: "rental",
    name: "Isuzu",
    brand: "Isuzu",
    year: 2020,
    mileage: 60000,
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80",
    specs: {
      fuel: "Diesel",
      transmission: "Manual",
      color: "Blue",
      seats: 5,
      plate: "445588",
      mpg: "20 MPG",
    },
    buy: null,
    rental: {
      pricePerDay: 850,
      price7Days: 5600,
      price30Days: 22000,
      terms: "Please read Term and Conditions",
    },
    status: {
      isAvailable: true,
      isMostRented: false,
    },
  },
];

export default mockAdminCars;