### Paso a paso para clonar el repositorio e instalar las dependencias

---

#### 1. Clonar el repositorio

Ejecuta el siguiente comando en tu terminal para clonar el repositorio desde GitHub (reemplaza `<URL_REPOSITORIO>` con la URL del repositorio):

```bash
git clone <URL_REPOSITORIO>
```

---

#### 2. Acceder al directorio del proyecto

Navega al directorio del proyecto clonado:

```bash
cd <NOMBRE_DEL_REPOSITORIO>
```

---

#### 3. Instalar las dependencias

Ejecuta el siguiente comando para instalar todas las dependencias necesarias definidas en el archivo `package.json`:

```bash
npm install
```

---

#### 4. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto y agrega las variables necesarias. Un ejemplo de configuración básica es:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=gestion
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRATION=3600
```

---

#### 5. Ejecutar la aplicación

Para iniciar la aplicación en modo desarrollo, utiliza:

```bash
npm run start:dev
```

---

#### 6. Verificar la aplicación

Abre tu navegador y accede a:

```
http://localhost:<PUERTO>
```

Por defecto, el puerto será `3000`, pero puedes verificarlo en el archivo de configuración o en la terminal tras ejecutar el comando.

---

### Configuración de la Aplicación Principal

La aplicación principal integra y conecta todos los módulos del proyecto, además de configurar la conexión a la base de datos y la carga de variables de entorno.

---

#### Estructura

- **AppController**: Controlador raíz que maneja la ruta principal (`/`).
- **AppService**: Servicio básico que proporciona el mensaje de bienvenida.
- **AppModule**: Módulo raíz que importa y configura todos los módulos del proyecto.

---

#### Componentes principales

1. **Controlador**: `app.controller.ts`

   - Maneja la ruta raíz de la aplicación.
   - Responde con un mensaje de saludo predeterminado.

   ```typescript
   @Get() // Ruta raíz
   getHello(): string {
       return this.appService.getHello();
   }
   ```

2. **Servicio**: `app.service.ts`

   - Contiene la lógica básica para la ruta principal.
   - Devuelve un mensaje de bienvenida.

   ```typescript
   getHello(): string {
       return '¡Hola, mundo!';
   }
   ```

3. **Módulo**: `app.module.ts`
   - Configura los módulos del proyecto y la conexión a la base de datos.
   - Importa los siguientes módulos:
     - **UsuarioModule**: Gestión de usuarios y autenticación.
     - **CompraModule**: Gestión de compras.
     - **DetalleCompraModule**: Gestión de detalles de compra.
     - **ProductoModule**: Gestión de productos.
   - Configura **TypeORM** para conectar con la base de datos PostgreSQL.
   - Carga las variables de entorno mediante `ConfigModule`.

---

#### Configuración de TypeORM

La conexión a la base de datos PostgreSQL está configurada dinámicamente con las variables de entorno definidas en el archivo `.env`. Ejemplo de configuración:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_NAME=gestion
NODE_ENV=development
SERVER_DIRR=3000
JWT_EXPIRATION=3600
JWT_SECRET=tu_Secreto_jwt

```

El archivo `app.module.ts` utiliza `TypeOrmModule.forRootAsync` para cargar esta configuración:

```typescript
TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [DetalleCompra, Compra, Usuario, Producto],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
    }),
}),
```

---

#### Ruta principal

La ruta raíz (`/`) proporciona un mensaje de bienvenida básico:

- **Método**: `GET`
- **Endpoint**: `/`
- **Respuesta**:
  ```json
  {
    "message": "¡Hola, mundo!"
  }
  ```

---

#### Módulos Importados

- **DetalleCompraModule**: Gestión de detalles de las compras realizadas.
- **CompraModule**: Gestión de compras por parte de los usuarios.
- **UsuarioModule**: Manejo de usuarios, autenticación y roles.
- **ProductoModule**: Gestión del catálogo de productos.

---

#### Notas adicionales

- La sincronización de la base de datos (`synchronize`) está habilitada solo en entornos de desarrollo para evitar modificaciones accidentales en entornos de producción.
- Este módulo actúa como punto de integración para todos los módulos del sistema, asegurando que estén correctamente conectados y configurados.

### Módulo de Usuario

Este módulo gestiona las operaciones relacionadas con los usuarios en el sistema, como registro, inicio de sesión, gestión de roles y protección de rutas.

---

#### Funcionalidades principales

- **Registro de Usuarios**: Permite registrar nuevos usuarios con validación de datos, como correo único y contraseña encriptada.
- **Inicio de Sesión**: Autenticación basada en JWT, proporcionando un token para acceder a rutas protegidas.
- **Gestión de Roles**: Protección de rutas basada en roles, diferenciando entre usuarios `admin` y `usuario`.
- **Operaciones CRUD**: Consultar, actualizar y eliminar usuarios.
- **Protección con Guards**: Verifica tokens y roles para acceder a ciertas rutas.

---

#### Rutas disponibles

1. **Registrar un nuevo usuario**

   - **Método**: `POST`
   - **Endpoint**: `/usuarios/registro`
   - **Cuerpo de la solicitud**:
     ```json
     {
       "nombre": "Juan Pérez",
       "correo": "juan.perez@example.com",
       "contrasena": "password123",
       "esAdmin": true,
       "direccion": "Calle Falsa 123",
       "telefono": "+5491123456789"
     }
     ```
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "nombre": "Juan Pérez",
       "correo": "juan.perez@example.com"
     }
     ```

2. **Iniciar sesión**

   - **Método**: `POST`
   - **Endpoint**: `/usuarios/login`
   - **Cuerpo de la solicitud**:
     ```json
     {
       "correo": "juan.perez@example.com",
       "contrasena": "password123"
     }
     ```
   - **Respuesta**:
     ```json
     {
       "token": "jwt_token_aqui"
     }
     ```

3. **Obtener todos los usuarios** (Protegido)

   - **Método**: `GET`
   - **Endpoint**: `/usuarios`
   - **Requiere Rol**: `admin`
   - **Respuesta**:
     ```json
     [
       {
         "id": 1,
         "nombre": "Juan Pérez",
         "correo": "juan.perez@example.com",
         "esAdmin": true
       }
     ]
     ```

4. **Obtener un usuario por ID** (Protegido)
   - **Método**: `GET`
   - **Endpoint**: `/usuarios/:id`
   - **Requiere Rol**: `admin`
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "nombre": "Juan Pérez",
       "correo": "juan.perez@example.com",
       "esAdmin": true
     }
     ```

---

#### Componentes del módulo

- **DTOs (Data Transfer Objects)**:

  - `crear-usuario.dto.ts`: Define los datos requeridos para registrar un usuario.
  - `login-usuario.dto.ts`: Estructura para realizar el inicio de sesión.

- **Entidad**:

  - `usuario.entity.ts`: Define la estructura del usuario en la base de datos, incluyendo relaciones con el módulo de compras.

- **Controlador**:

  - `usuario.controller.ts`: Maneja las solicitudes HTTP relacionadas con usuarios, como registro, inicio de sesión y consultas.

- **Servicio**:

  - `usuario.service.ts`: Contiene la lógica de negocio, como encriptar contraseñas, generar tokens JWT y realizar consultas a la base de datos.

- **Guard y Decorador**:

  - `roles.guard.ts`: Verifica si el usuario tiene los permisos necesarios para acceder a ciertas rutas.
  - `roles.decorador.ts`: Especifica los roles permitidos para acceder a un endpoint.

- **Módulo**:
  - `usuario.module.ts`: Configura la integración con el servicio de JWT, el repositorio de usuarios y el controlador correspondiente.

---

#### Seguridad y Roles

- **Roles disponibles**:

  - `admin`: Acceso total a las rutas relacionadas con la gestión de usuarios.
  - `usuario`: Acceso limitado a rutas básicas.

- **Protección de rutas**:
  - Rutas protegidas mediante `RolesGuard`, verificando el token JWT y el rol del usuario.
  - Contraseñas almacenadas de forma segura utilizando bcrypt.

---

#### Notas adicionales

- Este módulo utiliza `JwtService` para la generación y validación de tokens JWT.
- Se implementa un mecanismo para evitar duplicidad de números de teléfono en el registro.
- El guard de roles asegura que solo usuarios con permisos adecuados accedan a ciertas rutas.

Este módulo es esencial para manejar la seguridad y la autenticación en el sistema.

### Decorador para Respuestas Estandarizadas (`api-response.decorator.ts`)

Este decorador proporciona una forma consistente y reutilizable de documentar las respuestas de los endpoints en **Swagger**. Mejora la claridad de la documentación generada, asegurando que todos los endpoints sigan un formato estándar para los diferentes códigos de estado HTTP.

---

#### Propósito

- Estandarizar las respuestas de los endpoints.
- Mejorar la documentación generada por **Swagger**.
- Reducir redundancia en la definición de respuestas comunes para cada endpoint.

---

#### Implementación

El decorador `ApiResponseStandard` se utiliza para añadir automáticamente respuestas estandarizadas a los endpoints de un controlador. Estas incluyen:

- **200**: Respuesta exitosa.
- **400**: Solicitud incorrecta (bad request).
- **404**: Recurso no encontrado.
- **500**: Error interno del servidor.

---

#### Uso

1. **Importación y Aplicación**:

   ```typescript
   import { ApiResponseStandard } from '../common/api-response.decorator';

   @Controller('usuarios')
   export class UsuarioController {
     @Get()
     @ApiResponseStandard('Lista de usuarios obtenida con éxito')
     getAll() {
       // Lógica para obtener todos los usuarios
     }
   }
   ```

2. **Resultados en Swagger**:

   Al aplicar este decorador, Swagger documentará las posibles respuestas del endpoint de forma automática, incluyendo:

   - Estado 200: `Lista de usuarios obtenida con éxito - Éxito`.
   - Estado 400: `Solicitud incorrecta`.
   - Estado 404: `No encontrado`.
   - Estado 500: `Error interno del servidor`.

---

#### Parámetros

- **`description`**: Descripción de la operación que se está documentando. Este texto se mostrará en el resumen de la operación y se combinará con el mensaje para el estado 200.

---

#### Ventajas

- **Consistencia**: Permite mantener un formato común en todas las respuestas documentadas.
- **Mantenimiento reducido**: Simplifica la documentación al eliminar la necesidad de definir manualmente respuestas para cada endpoint.
- **Claridad**: Proporciona información detallada sobre las posibles respuestas a los desarrolladores y testers que consumen la API.

---

#### Ejemplo Completo

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiResponseStandard } from '../common/api-response.decorator';

@Controller('productos')
export class ProductoController {
  @Get()
  @ApiResponseStandard('Lista de productos obtenida con éxito')
  getAll() {
    // Lógica para obtener todos los productos
  }
}
```

Con este decorador aplicado, los endpoints de la API se documentan de forma clara y uniforme en Swagger, mejorando la experiencia para quienes interactúan con la API.

### Módulo de Compras

Este módulo se encarga de gestionar las operaciones relacionadas con las compras realizadas por los usuarios. Permite crear nuevas compras, obtener detalles de compras existentes, y listar todas las compras realizadas.

---

#### Funcionalidades principales

- **Creación de Compras**: Los usuarios pueden realizar compras asociadas a su cuenta.
- **Consulta de Compras**: Permite obtener todas las compras registradas o una compra específica por su ID.
- **Relaciones con Usuarios y Detalles de Compra**: Cada compra está vinculada a un usuario y puede incluir múltiples detalles de compra.

---

#### Rutas disponibles

1. **Crear una nueva compra**

   - **Método**: `POST`
   - **Endpoint**: `/compras`
   - **Requiere Rol**: `admin` o `usuario`
   - **Cuerpo de la solicitud**:
     ```json
     {
       "usuarioId": 1,
       "fechaCompra": "2024-11-05T10:30:00Z",
       "metodoPago": "Tarjeta de crédito",
       "total": 150.75
     }
     ```
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "usuario": {
         "id": 1,
         "nombre": "Juan Pérez"
       },
       "fechaCompra": "2024-11-05T10:30:00Z",
       "metodoPago": "Tarjeta de crédito",
       "total": 150.75,
       "detallesCompra": []
     }
     ```

2. **Obtener todas las compras**

   - **Método**: `GET`
   - **Endpoint**: `/compras`
   - **Requiere Rol**: `admin` o `usuario`
   - **Respuesta**:
     ```json
     [
       {
         "id": 1,
         "usuario": {
           "id": 1,
           "nombre": "Juan Pérez"
         },
         "fechaCompra": "2024-11-05T10:30:00Z",
         "metodoPago": "Tarjeta de crédito",
         "total": 150.75,
         "detallesCompra": []
       }
     ]
     ```

3. **Obtener una compra por ID**
   - **Método**: `GET`
   - **Endpoint**: `/compras/:id`
   - **Requiere Rol**: `admin` o `usuario`
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "usuario": {
         "id": 1,
         "nombre": "Juan Pérez"
       },
       "fechaCompra": "2024-11-05T10:30:00Z",
       "metodoPago": "Tarjeta de crédito",
       "total": 150.75,
       "detallesCompra": []
     }
     ```

---

#### Componentes del módulo

- **DTO (Data Transfer Object)**:

  - `crear-compra.dto.ts`: Define los datos requeridos para crear una nueva compra, como el ID del usuario, fecha, método de pago y total.

- **Entidad**:

  - `compra.entity.ts`: Define la estructura de la compra en la base de datos. Incluye relaciones con los módulos de usuario y detalles de compra.

- **Controlador**:

  - `compra.controller.ts`: Maneja las solicitudes HTTP relacionadas con las compras, como crear y consultar compras.

- **Servicio**:

  - `compra.service.ts`: Contiene la lógica de negocio, como asociar compras a usuarios, validar datos y consultar la base de datos.

- **Módulo**:
  - `compra.module.ts`: Configura el módulo, incluyendo las dependencias necesarias como TypeORM y JwtModule.

---

#### Relaciones clave

- **Usuario**: Cada compra está asociada a un usuario mediante la relación `ManyToOne`.
- **Detalles de Compra**: Cada compra puede tener múltiples detalles de compra mediante la relación `OneToMany`.

---

#### Seguridad y Roles

- **Roles disponibles**:

  - `admin`: Puede acceder a todas las compras.
  - `usuario`: Puede consultar las compras asociadas a su cuenta y crear nuevas compras.

- **Protección de rutas**:
  - Las rutas están protegidas mediante `RolesGuard`, verificando el token JWT y el rol del usuario.

---

#### Notas adicionales

- Las compras se almacenan con una precisión de dos decimales para el total, utilizando `decimal` en la base de datos.
- Se puede extender la funcionalidad para incluir filtros adicionales, como rango de fechas o método de pago.

Este módulo es esencial para gestionar las transacciones realizadas por los usuarios y mantener un registro claro de las compras en el sistema.

### Módulo de Detalles de Compra

El módulo de detalles de compra gestiona los productos asociados a una compra específica. Este módulo permite registrar, consultar y calcular automáticamente los subtotales de los productos incluidos en una compra.

---

#### Funcionalidades principales

- **Creación de Detalles de Compra**: Permite registrar los productos adquiridos, la cantidad y el precio unitario por producto, calculando automáticamente el subtotal.
- **Consulta de Detalles de Compra**: Proporciona una lista de todos los detalles registrados o asociados a una compra específica.
- **Relaciones con Compras y Productos**: Los detalles de compra están vinculados tanto a una compra como a los productos adquiridos.

---

#### Rutas disponibles

1. **Crear detalles de compra**

   - **Método**: `POST`
   - **Endpoint**: `/detalles-compra`
   - **Requiere Rol**: `admin` o `usuario`
   - **Cuerpo de la solicitud**:
     ```json
     {
       "compraId": 1,
       "productoIds": [101, 102],
       "cantidad": 3
     }
     ```
   - **Respuesta**:
     ```json
     [
       {
         "id": 1,
         "compra": {
           "id": 1,
           "fechaCompra": "2024-11-05T10:30:00Z"
         },
         "producto": {
           "id": 101,
           "nombre": "Producto A"
         },
         "cantidad": 3,
         "precio": 50.25,
         "subtotal": 150.75
       },
       ...
     ]
     ```

2. **Obtener todos los detalles de compra**
   - **Método**: `GET`
   - **Endpoint**: `/detalles-compra`
   - **Requiere Rol**: `admin` o `usuario`
   - **Respuesta**:
     ```json
     [
       {
         "id": 1,
         "compra": {
           "id": 1,
           "fechaCompra": "2024-11-05T10:30:00Z"
         },
         "producto": {
           "id": 101,
           "nombre": "Producto A"
         },
         "cantidad": 3,
         "precio": 50.25,
         "subtotal": 150.75
       },
       ...
     ]
     ```

---

#### Componentes del módulo

- **DTO (Data Transfer Object)**:

  - `detalle-compra.dto.ts`: Define los datos requeridos para registrar un detalle de compra, como el ID de la compra, los IDs de los productos, la cantidad y el subtotal.

- **Entidad**:

  - `detalle-compra.entity.ts`: Define la estructura del detalle de compra en la base de datos, incluyendo relaciones con las entidades de `Compra` y `Producto`.

- **Controlador**:

  - `detalle-compra.controller.ts`: Gestiona las solicitudes HTTP relacionadas con los detalles de compra.

- **Servicio**:

  - `detalle-compra.service.ts`: Contiene la lógica de negocio, como la creación de detalles de compra, cálculos automáticos y consultas.

- **Módulo**:
  - `detalle-compra.module.ts`: Configura el módulo e importa las dependencias necesarias, como los módulos de compras y productos.

---

#### Relaciones clave

- **Compra**: Cada detalle de compra está vinculado a una compra mediante una relación `ManyToOne`.
- **Producto**: Cada detalle de compra está vinculado a un producto específico mediante una relación `ManyToOne`.

---

#### Seguridad y Roles

- **Roles disponibles**:

  - `admin`: Puede acceder a todos los detalles de compra.
  - `usuario`: Puede consultar y registrar detalles de compras asociadas a sus transacciones.

- **Protección de rutas**:
  - Las rutas están protegidas mediante `RolesGuard`, verificando el token JWT y los roles del usuario.

---

#### Notas adicionales

- Los subtotales se calculan automáticamente multiplicando la cantidad de productos por su precio unitario.
- Este módulo permite la asociación de múltiples productos a una única compra, manteniendo un registro detallado de los artículos adquiridos.

Este módulo es clave para gestionar y registrar los detalles de las transacciones de los usuarios, proporcionando un desglose claro y detallado de cada compra.

### Módulo de Producto

El módulo de producto permite gestionar los productos disponibles en el sistema, proporcionando operaciones CRUD para crear, consultar, actualizar y eliminar productos.

---

#### Funcionalidades principales

- **Creación de productos**: Permite registrar nuevos productos con información como nombre, descripción, precio, stock e imagen opcional.
- **Consulta de productos**: Permite listar todos los productos o buscar uno específico por su ID.
- **Actualización de productos**: Permite modificar la información de un producto existente.
- **Eliminación de productos**: Permite eliminar productos del sistema.
- **Protección con roles**: Las operaciones sensibles, como creación, actualización y eliminación, están protegidas por roles.

---

#### Rutas disponibles

1. **Crear un producto**

   - **Método**: `POST`
   - **Endpoint**: `/productos`
   - **Requiere Rol**: `admin`
   - **Cuerpo de la solicitud**:
     ```json
     {
       "nombre": "Producto A",
       "descripcion": "Descripción del producto",
       "precio": 50.25,
       "stock": 100,
       "imagenUrl": "http://example.com/imagen.jpg"
     }
     ```
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "nombre": "Producto A",
       "descripcion": "Descripción del producto",
       "precio": 50.25,
       "stock": 100,
       "imagenUrl": "http://example.com/imagen.jpg"
     }
     ```

2. **Obtener todos los productos**

   - **Método**: `GET`
   - **Endpoint**: `/productos`
   - **Respuesta**:
     ```json
     [
       {
         "id": 1,
         "nombre": "Producto A",
         "descripcion": "Descripción del producto",
         "precio": 50.25,
         "stock": 100,
         "imagenUrl": "http://example.com/imagen.jpg"
       },
       ...
     ]
     ```

3. **Obtener un producto por ID**

   - **Método**: `GET`
   - **Endpoint**: `/productos/:id`
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "nombre": "Producto A",
       "descripcion": "Descripción del producto",
       "precio": 50.25,
       "stock": 100,
       "imagenUrl": "http://example.com/imagen.jpg"
     }
     ```

4. **Actualizar un producto**

   - **Método**: `PUT`
   - **Endpoint**: `/productos/:id`
   - **Requiere Rol**: `admin`
   - **Cuerpo de la solicitud**:
     ```json
     {
       "nombre": "Producto A Actualizado",
       "descripcion": "Descripción actualizada del producto",
       "precio": 55.0,
       "stock": 80,
       "imagenUrl": "http://example.com/imagen_actualizada.jpg"
     }
     ```
   - **Respuesta**:
     ```json
     {
       "id": 1,
       "nombre": "Producto A Actualizado",
       "descripcion": "Descripción actualizada del producto",
       "precio": 55.0,
       "stock": 80,
       "imagenUrl": "http://example.com/imagen_actualizada.jpg"
     }
     ```

5. **Eliminar un producto**
   - **Método**: `DELETE`
   - **Endpoint**: `/productos/:id`
   - **Requiere Rol**: `admin`
   - **Respuesta**:
     ```json
     {
       "message": "Producto eliminado con éxito"
     }
     ```

---

#### Componentes del módulo

- **DTO (Data Transfer Object)**:

  - `crear-producto.dto.ts`: Define los datos requeridos para registrar o actualizar un producto, como nombre, descripción, precio, stock e imagen opcional.

- **Entidad**:

  - `producto.entity.ts`: Define la estructura del producto en la base de datos.

- **Controlador**:

  - `producto.controller.ts`: Maneja las solicitudes HTTP relacionadas con los productos.

- **Servicio**:

  - `producto.service.ts`: Contiene la lógica de negocio, como la creación, consulta, actualización y eliminación de productos.

- **Módulo**:
  - `producto.module.ts`: Configura el módulo, incluyendo las dependencias necesarias como TypeORM y JwtModule.

---

#### Seguridad y Roles

- **Roles disponibles**:

  - `admin`: Puede crear, actualizar, eliminar y consultar productos.
  - `usuario`: Puede consultar productos.

- **Protección de rutas**:
  - Las operaciones sensibles están protegidas mediante `RolesGuard`, verificando el token JWT y el rol del usuario.

---

#### Notas adicionales

- Los precios de los productos se almacenan con dos decimales de precisión.
- El módulo puede ampliarse para incluir funcionalidades como búsqueda avanzada o categorización de productos.

Este módulo es esencial para administrar el catálogo de productos en el sistema, permitiendo operaciones seguras y eficaces.
