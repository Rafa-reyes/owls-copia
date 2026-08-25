const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Intentando conectar a Prisma...");
    // Intentamos hacer una consulta básica. Cambia "alumno" si tu tabla se llama distinto.
    const resultado = await prisma.alumno.findFirst();
    console.log("¡Conexión exitosa! Resultado:", resultado);
}
main()
    .catch(e => console.error("Fallo en la prueba:", e))
    .finally(async () => await prisma.$disconnect());