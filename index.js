import express from "express";
import cors from "cors";
import env from "dotenv";
import nodemailer from "nodemailer";
import schedule from "node-schedule";
env.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

app.post("/", (req, res) => {
  const { nombre, correo, tipoServicio, celular, razonSocial } = req.body;
  if (nombre && correo && tipoServicio && celular && razonSocial) {
    const mailOpt = {
      from: process.env.USER,
      to: correo,
      subject: "Nueva Venta Corporativa",
      html: `<p>Tipo de Servicio: ${tipoServicio}</p><p>Nombre: ${nombre}</p><p>Celular: ${celular}</p><p>Correo: ${correo}</p><p>Razon Social: ${razonSocial}</p>`,
    };
    transporter.sendMail(mailOpt, (error, info) => {
      if (error) {
        console.log("error: ", error);
        return res.status(500).json(error.message || "Internal Server Error");
      }
      console.log(info?.response);
      return res.json(info?.response || "Email sent.");
    });
  }
});

schedule.scheduleJob("0 8 * * *", () => {
  console.log("It runs");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
