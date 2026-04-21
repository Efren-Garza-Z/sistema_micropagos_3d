# Sistema de Micropagos 3D en Solana 🚀

Este proyecto es un Smart Contract (Programa) desarrollado con el framework Anchor que permite gestionar un inventario de activos 3D (archivos `.glb`) sobre la blockchain de Solana (Devnet).



<div align="center">
  <img width="390" height="390" alt="image" src="https://github.com/Efren-Garza-Z/sistema_micropagos_3d/blob/main/imgs/pollito.png" />
</div> 

## 🎯 Objetivo del Proyecto

El fin de este CRUD es proporcionar una infraestructura descentralizada para que creadores de contenido 3D puedan registrar sus modelos, asignarles un precio en Lamports y gestionar su disponibilidad. A diferencia de un CRUD tradicional, los datos no residen en un servidor central, sino en Cuentas (PDAs) únicas dentro de la red Solana, asegurando transparencia y propiedad real.

## 📸 Demostración de Funcionalidad

> <img width="821" height="190" alt="image" src="https://github.com/Efren-Garza-Z/sistema_micropagos_3d/blob/main/imgs/build_and_deploy.png" />


### 1. Registro de Modelo (CREATE)
Permite inicializar una cuenta en la blockchain vinculada al autor y al nombre del archivo.

> <img width="821" height="390" alt="image" src="https://github.com/Efren-Garza-Z/sistema_micropagos_3d/blob/main/imgs/create.png" />

### 2. Consulta de Datos (READ)
Lectura de los metadatos directamente desde la cuenta del programa.

> <img width="821" height="390" alt="image" src="https://github.com/Efren-Garza-Z/sistema_micropagos_3d/blob/main/imgs/read.png" />

### 3. Actualización de Precio (UPDATE)
Solo el autor original tiene permisos para modificar el costo del activo.

> <img width="821" height="400" alt="image" src="https://github.com/Efren-Garza-Z/sistema_micropagos_3d/blob/main/imgs/update.png" />

### 4. Eliminación y Recuperación de Renta (DELETE)
Cierra la cuenta en la blockchain y devuelve los SOL depositados por el espacio (Rent) a la wallet del autor.

> <img width="821" height="190" alt="image" src="https://github.com/Efren-Garza-Z/sistema_micropagos_3d/blob/main/imgs/delete.png" />

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
|-----------|------------|
| Lenguaje | Rust 🦀 |
| Framework | Anchor (v0.29.0) |
| Entorno | Solana Playground (Devnet) |
| Testing | TypeScript (Client-side tests) |

## 🧬 Estructura de Datos (On-Chain)

Cada modelo se guarda en una cuenta con la siguiente estructura:

```rust
pub struct Modelo3D {
    pub autor: Pubkey,          // Dueño del modelo
    pub nombre_archivo: String, // Identificador único (.glb)
    pub precio: u64,            // Precio en Lamports
    pub esta_disponible: bool,  // Estado de venta
}
```

## 🚀 Cómo probar este programa

1. Abrir [Solana Playground](https://beta.solpg.io).
2. Importar el archivo `lib.rs`.
3. Ejecutar `build` y `deploy` en la red Devnet.
4. Correr los tests incluidos en `anchor.test.ts` para verificar el ciclo de vida completo.
