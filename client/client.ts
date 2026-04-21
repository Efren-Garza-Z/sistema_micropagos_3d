//////////////////// Imports ////////////////////
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

////////////////// Constantes ////////////////////
const NOMBRE_MODELO = "carro_deportivo.glb";
const PRECIO_INICIAL = new BN(1000000); // 0.001 SOL
const NUEVO_PRECIO = new BN(5000000);   // 0.005 SOL
const autor = pg.wallet.publicKey;

//////////////////// Logs base ////////////////////
console.log("Autor address:", autor.toBase58());
const balance = await pg.connection.getBalance(autor);
console.log(`Saldo actual: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

//////////////////// PDA Modelo ////////////////////
// En Rust: seeds = [b"modelo", autor.key().as_ref(), nombre_archivo.as_bytes()]
function pdaModelo(nombre: string) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("modelo"),
      autor.toBuffer(),
      Buffer.from(nombre)
    ],
    pg.PROGRAM_ID
  );
}

//////////////////// Helpers ////////////////////
async function fetchModelo(pda: PublicKey) {
  return await pg.program.account.modelo3D.fetch(pda);
}

function printDetalles(modeloAccount: any) {
  console.log("--- Información del Activo 3D ---");
  console.log(`Archivo: ${modeloAccount.nombreArchivo}`);
  console.log(`Precio: ${modeloAccount.precio.toString()} Lamports`);
  console.log(`Disponible: ${modeloAccount.estaDisponible ? "SÍ" : "NO"}`);
  console.log(`Autor: ${modeloAccount.autor.toBase58()}`);
  console.log("----------------------------------");
}

//////////////////// Instrucciones ////////////////////

async function registrarModelo(nombre: string, precio: BN) {
  const [pda] = pdaModelo(nombre);
  console.log("Registrando en PDA:", pda.toBase58());

  try {
    const txHash = await pg.program.methods
      .registrarModelo(nombre, precio)
      .accounts({
        cuentaModelo: pda,
        autor: autor,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✔ Registro exitoso. TX:", txHash);
    const data = await fetchModelo(pda);
    printDetalles(data);
  } catch (e) {
    console.error("Error al registrar:", e.message);
  }
}

async function actualizarPrecio(nombre: string, precio: BN) {
  const [pda] = pdaModelo(nombre);
  
  try {
    const txHash = await pg.program.methods
      .actualizarPrecio(precio)
      .accounts({
        cuentaModelo: pda,
        autor: autor,
      })
      .rpc();

    console.log("✔ Precio actualizado. TX:", txHash);
    const data = await fetchModelo(pda);
    printDetalles(data);
  } catch (e) {
    console.error("Error al actualizar:", e.message);
  }
}

async function verModelo(nombre: string) {
  const [pda] = pdaModelo(nombre);
  try {
    const data = await fetchModelo(pda);
    console.log("Leyendo datos actuales...");
    printDetalles(data);
  } catch (e) {
    console.log("El modelo no existe en la blockchain.");
  }
}

async function eliminarModelo(nombre: string) {
  const [pda] = pdaModelo(nombre);
  
  try {
    const txHash = await pg.program.methods
      .eliminarModelo()
      .accounts({
        cuentaModelo: pda,
        autor: autor,
      })
      .rpc();

    console.log("✔ Registro eliminado. SOL recuperados. TX:", txHash);
  } catch (e) {
    console.error("Error al eliminar:", e.message);
  }
}

//////////////////// Demo runner ////////////////////
// Descomenta las líneas según lo que quieras probar:

await registrarModelo(NOMBRE_MODELO, PRECIO_INICIAL);
// await actualizarPrecio(NOMBRE_MODELO, NUEVO_PRECIO);
// await verModelo(NOMBRE_MODELO);
// await eliminarModelo(NOMBRE_MODELO);
