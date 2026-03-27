-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE SistemaTicketsDB;
GO

USE SistemaTicketsDB;
GO

-- ============================================
-- TABLA USUARIOS
-- ============================================
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL
    RolId INT NOT NULL,
);
GO

-- ============================================
-- TABLA TICKETS
-- ============================================
CREATE TABLE Tickets (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Titulo NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(MAX) NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    Estado INT NOT NULL DEFAULT 0, -- Enum: 0=Nuevo,1=EnProceso,2=Resuelto,3=Cancelado

    ResponsableId INT NOT NULL,

    CONSTRAINT FK_Tickets_Usuarios
        FOREIGN KEY (ResponsableId)
        REFERENCES Usuarios(Id)
        ON DELETE NO ACTION
);
GO

-- ============================================
-- TABLA COMENTARIOS
-- ============================================
CREATE TABLE Comentarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Texto NVARCHAR(MAX) NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),

    TicketId INT NOT NULL,
    UsuarioId INT NOT NULL,

    CONSTRAINT FK_Comentarios_Tickets
        FOREIGN KEY (TicketId)
        REFERENCES Tickets(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_Comentarios_Usuarios
        FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios(Id)
        ON DELETE NO ACTION
);
GO

-- ============================================
-- TABLA ROLES
-- ============================================
CREATE TABLE [dbo].[Roles] (
    Id INT PRIMARY KEY,       -- 1 = Admin, 2 = Usuario
    Nombre NVARCHAR(50) NOT NULL
);

GO