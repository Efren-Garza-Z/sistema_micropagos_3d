describe("sistema_micropagos_3d", () => {
  it("Registrar un modelo 3D!", async () => {
    const nombreArchivo = "poyito.glb";
    const precio = new BN(1000000); // 0.001 SOL

    // Derivar la dirección PDA
    const [modeloPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("modelo"),
        pg.wallet.publicKey.toBuffer(),
        Buffer.from(nombreArchivo),
      ],
      pg.program.programId
    );

    // Llamar a la función registrar_modelo
    const txHash = await pg.program.methods
      .registrarModelo(nombreArchivo, precio)
      .accounts({
        cuentaModelo: modeloPDA,
        autor: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Modelo registrado con éxito. Hash:", txHash);
  });
});