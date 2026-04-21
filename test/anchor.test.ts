// No se necesitan imports, ya todo es global en SolPG

describe("Pruebas Sistema Micropagos", () => {
  const nombreArchivo = "mordecai_v3.glb";
  const precioInicial = new BN(1000000); // 0.001 SOL

  // 1. Derivar la dirección de la cuenta (PDA)
  const [modeloPDA] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("modelo"),
      pg.wallet.publicKey.toBuffer(),
      Buffer.from(nombreArchivo),
    ],
    pg.program.programId
  );

  it("Registrar y Verificar Modelo", async () => {
    // Enviar transacción
    const txHash = await pg.program.methods
      .registrarModelo(nombreArchivo, precioInicial)
      .accounts({
        cuentaModelo: modeloPDA,
        autor: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log(`Transacción exitosa: ${txHash}`);

    // Confirmar transacción
    await pg.connection.confirmTransaction(txHash);

    // Traer la cuenta de la blockchain
    const cuenta = await pg.program.account.modelo3D.fetch(modeloPDA);

    console.log("Datos en cadena:");
    console.log("Archivo:", cuenta.nombreArchivo);
    console.log("Precio:", cuenta.precio.toString());

    // Verificación simple (estilo el ejemplo que pasaste)
    if (cuenta.nombreArchivo === nombreArchivo) {
        console.log("✔ El nombre coincide correctamente.");
    }
  });
});
