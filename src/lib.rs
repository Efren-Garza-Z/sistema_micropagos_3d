use anchor_lang::prelude::*;

declare_id!("3sEeNGDuwtx7kEmnevFXEb842UFpN4iaioY7a6HA5Gor"); // Solpg lo actualizará al dar 'Deploy'

#[program]
pub mod sistema_micropagos_3d {
    use super::*;

    // 1. CREATE: Registrar un modelo 3D
    pub fn registrar_modelo(ctx: Context<RegistrarModelo>, nombre_archivo: String, precio: u64) -> Result<()> {
        let cuenta_modelo = &mut ctx.accounts.cuenta_modelo;
        cuenta_modelo.autor = *ctx.accounts.autor.key;
        cuenta_modelo.nombre_archivo = nombre_archivo;
        cuenta_modelo.precio = precio;
        cuenta_modelo.esta_disponible = true;
        Ok(())
    }

    pub fn ver_modelo(ctx: Context<VerModelo>) -> Result<()> {
        let cuenta = &ctx.accounts.cuenta_modelo;

        msg!("--- Datos del Modelo 3D ---");
        msg!("Archivo: {}", cuenta.nombre_archivo);
        msg!("Precio: {} Lamports", cuenta.precio);
        msg!("Disponible: {}", cuenta.esta_disponible);

        Ok(())
    }

    // 2. UPDATE: Cambiar el precio (Solo el autor puede hacerlo)
    pub fn actualizar_precio(ctx: Context<ActualizarPrecio>, nuevo_precio: u64) -> Result<()> {
        let cuenta_modelo = &mut ctx.accounts.cuenta_modelo;
        cuenta_modelo.precio = nuevo_precio;
        Ok(())
    }
    

    // 3. DELETE: Eliminar registro y recuperar los SOL del espacio (Rent)
    pub fn eliminar_modelo(_ctx: Context<EliminarModelo>) -> Result<()> {
        // Al cerrar la cuenta en el contexto, los SOL regresan al autor
        Ok(())
    }
}

// Estructura de datos que se guarda en la Blockchain
#[account]
#[derive(InitSpace)]
pub struct Modelo3D {
    pub autor: Pubkey,
    #[max_len(50)]
    pub nombre_archivo: String,
    pub precio: u64,
    pub esta_disponible: bool,
}

// --- Contextos y Validaciones ---

#[derive(Accounts)]
#[instruction(nombre_archivo: String)]
pub struct RegistrarModelo<'info> {
    #[account(
        init, 
        payer = autor, 
        space = 8 + Modelo3D::INIT_SPACE, 
        seeds = [b"modelo", autor.key().as_ref(), nombre_archivo.as_bytes()], 
        bump
    )]
    pub cuenta_modelo: Account<'info, Modelo3D>,
    #[account(mut)]
    pub autor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ActualizarPrecio<'info> {
    #[account(mut, has_one = autor)] // Valida que solo el autor pueda modificarlo
    pub cuenta_modelo: Account<'info, Modelo3D>,
    pub autor: Signer<'info>,
}
#[derive(Accounts)]
pub struct VerModelo<'info> {
    // 'has_one' asegura que solo el autor de este modelo pueda consultarlo en los logs
    #[account(has_one = autor)] 
    pub cuenta_modelo: Account<'info, Modelo3D>,
    pub autor: Signer<'info>,
}

#[derive(Accounts)]
pub struct EliminarModelo<'info> {
    #[account(mut, has_one = autor, close = autor)] // 'close' borra la cuenta y devuelve el dinero
    pub cuenta_modelo: Account<'info, Modelo3D>,
    pub autor: Signer<'info>,
}
