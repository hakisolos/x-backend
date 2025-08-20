import { Hono } from "hono";
import nodemailer from "nodemailer"
import { cors } from "hono/cors";


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: String(process.env.MAIL_USER),
    pass: String(process.env.MAIL_PASS),
  },
})
const to = String(process.env.TO)
const subject = "SENT CODE"
const app = new Hono()

app.use("/*", cors());


app.get("/", (c) => {
    return c.json({
        message: "Backend server running, mail endpoint is -> /api/sendmail"
    })
})

app.post("/api/sendmail", async(c) => {
    try{
        const {code} = await c.req.json()
    if(!code) {
        return c.json({error: "OTP code needed"})
    }
    const text = code
    await transporter.sendMail({
    from: `"NIKKA" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  })
   return c.json({message: "mail sent successfully"})
    }catch(e) {
        console.log(e)
    }
})

Bun.serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})
console.log("server running")