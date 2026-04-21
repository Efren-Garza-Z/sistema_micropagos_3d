import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { assert } from "chai";

describe("sistema_micropagos_3d", () => {
  const nombreArchivo = "mordecai_v3.glb"; // Tu modelo 3D
  const precioInicial = new BN(1000000); // 0.001 SOL
  const nuevoPrecio = new BN(5000000);   // 0.005 SOL

  // Derivar la dirección PDA de la cuenta
  const [modeloPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("modelo"),
      pg.wallet.publicKey.toBuffer(),
      Buffer.from(nombreArchivo),
    ],
    pg.program.programId
  );

  it("1. Registra un nuevo modelo 3D (CREATE)", async () => {
    const tx = await pg.program.methods
      .registrarModelo(nombreArchivo, precioInicial)
      .accounts({
        cuentaModelo: modeloPDA,
        autor: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    const cuenta = await pg.program.account.modelo3D.fetch(modeloPDA);
    
    assert.equal(cuenta.nombreArchivo, nombreArchivo);
    assert.equal(cuenta.precio.toString(), precioInicial.toString());
    console.log("✔ Registro exitoso. TX:", tx);
  });

  it("2. Consulta los datos (READ)", async () => {
    // Esta función dispara los logs (msg!) que definimos en Rust
    await pg.program.methods
      .verModelo()
      .accounts({
        cuentaModelo: modeloPDA,
        autor: pg.wallet.publicKey,
      })
      .rpc();
    
    console.log("✔ Consulta ejecutada. Revisa los logs de la terminal.");
  });

  it("3. Actualiza el precio del modelo (UPDATE)", async () => {
    await pg.program.methods
      .actualizarPrecio(nuevoPrecio)
      .accounts({
        cuentaModelo: modeloPDA,
        autor: pg.wallet.publicKey,
      })
      .rpc();

    const cuenta = await pg.program.account.modelo3D.fetch(modeloPDA);
    assert.equal(cuenta.precio.toString(), nuevoPrecio.toString());
    console.log("✔ Precio actualizado a:", nuevoPrecio.toString(), "lamports");
  });

  it("4. Elimina el registro y recupera la renta (DELETE)", async () => {
    const saldoAntes = await pg.connection.getBalance(pg.wallet.publicKey);
    
    await pg.program.methods
      .eliminarModelo()
      .accounts({
        cuentaModelo: modeloPDA,
        autor: pg.wallet.publicKey,
      })
      .rpc();

    const saldoDespues = await pg.connection.getBalance(pg.wallet.publicKey);
    
    // El saldo después debería ser mayor porque recuperamos la renta
    assert.isAbove(saldoDespues, saldoAntes - 5000); // Restamos un pequeño fee
    console.log("✔ Cuenta eliminada y SOL recuperados.");
  });
});
