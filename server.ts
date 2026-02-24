import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("punto_hogar.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    type TEXT CHECK(type IN ('venta', 'alquiler')) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area INTEGER,
    image_url TEXT,
    category TEXT CHECK(category IN ('casa', 'apartamento', 'terreno', 'comercial')) NOT NULL
  )
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM properties").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO properties (title, description, price, location, type, bedrooms, bathrooms, area, image_url, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedData = [
    ["Apartamento Moderno en Miraflores", "Hermoso apartamento con vista al mar, acabados de lujo.", 150000, "Lima, Miraflores", "venta", 2, 2, 85, "/img/imagen1.png", "apartamento"],
    ["Apartamento Moderno en Miraflores", "Hermoso apartamento con vista al mar, acabados de lujo.", 150000, "Lima, Miraflores", "venta", 2, 2, 85, "/img/imagen2.png", "apartamento"],
    ["Apartamento Moderno en Miraflores", "Hermoso apartamento con vista al mar, acabados de lujo.", 150000, "Lima, Miraflores", "venta", 2, 2, 85, "/img/imagen4.png", "apartamento"],
    ["Apartamento Moderno en Miraflores", "Hermoso apartamento con vista al mar, acabados de lujo.", 150000, "Lima, Miraflores", "venta", 2, 2, 85, "/img/imagen5.png", "apartamento"],
    ["Apartamento Moderno en Miraflores", "Hermoso apartamento con vista al mar, acabados de lujo.", 150000, "Lima, Miraflores", "venta", 2, 2, 85, "/img/imagen6.png", "apartamento"],
    ["Casa Familiar en La Molina", "Espaciosa casa ideal para familias, zona tranquila y segura.", 320000, "Lima, La Molina", "venta", 4, 3, 250, "/img/imagen7.png", "casa"],
    ["Estudio Luminoso en Barranco", "Pequeño pero acogedor estudio cerca del malecón.", 800, "Lima, Barranco", "alquiler", 1, 1, 40, "/img/imagen6.png", "apartamento"],
    ["Chalet de Lujo en San Isidro", "Increíble chalet con todas las comodidades y acabados premium.", 850000, "Lima, San Isidro", "venta", 5, 4, 400, "/img/imagen6.png", "casa"],
    ["Local Comercial en San Borja", "Excelente ubicación para tu negocio, gran afluencia de público.", 1200, "Lima, San Borja", "alquiler", 0, 1, 120, "/img/imagen6.png", "comercial"],
    ["Terreno en Pachacamac", "Oportunidad de inversión en zona de crecimiento campestre.", 90000, "Lima, Pachacamac", "venta", 0, 0, 1000, "/img/imagen6.png", "terreno"],
    ["Departamento de Estreno en Surco", "Cerca a centros comerciales y parques, excelente distribución.", 185000, "Lima, Santiago de Surco", "venta", 3, 2, 110, "/img/imagen6.png", "apartamento"],
    ["Oficina Moderna en Magdalena", "Edificio empresarial de primer nivel, zona estratégica.", 1500, "Lima, Magdalena del Mar", "alquiler", 0, 2, 90, "/img/imagen4.png", "comercial"],
    ["Penthouse en Miraflores", "Vistas espectaculares, terraza privada y acabados de mármol.", 450000, "Lima, Miraflores", "venta", 3, 3, 180, "/img/imagen5.png", "apartamento"],
    ["Casa de Playa en Asia", "Ubicada en exclusivo condominio, piscina propia y club house.", 250000, "Lima, Asia", "venta", 4, 4, 200, "/img/imagen7.png", "casa"]
  ];

  for (const data of seedData) {
    insert.run(...data);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/properties", (req, res) => {
    const { type, category, minPrice, maxPrice, search } = req.query;
    let query = "SELECT * FROM properties WHERE 1=1";
    const params: any[] = [];

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(Number(maxPrice));
    }
    if (search) {
      query += " AND (title LIKE ? OR location LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const properties = db.prepare(query).all(...params);
    res.json(properties);
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: "Propiedad no encontrada" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
