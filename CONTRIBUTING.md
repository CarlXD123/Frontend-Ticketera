# Contributing to Sistema de Gestión de Tickets - Backend API

¡Gracias por tu interés en contribuir al Sistema de Gestión de Tickets! Este documento te guiará sobre cómo contribuir de manera efectiva a este proyecto.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Proceso de Contribución](#proceso-de-contribución)
- [Envío de Pull Requests](#envío-de-pull-requests)


## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Angular 21.2.3** o superior
- **Visual Studio Code**
- **Git**

## Configuración del Entorno de Desarrollo

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Frontend-Ticketera.git
cd Frontend-Ticketera
```

### 4. Ejecutar Localmente

```bash
# Ejecutar aplicación
ng serve
```

## Proceso de Contribución

### 1. Crear una Rama

```bash
git checkout -b feature/tu-nueva-funcionalidad
```
**Nomenclatura de ramas:**
- `feature/nombre-funcionalidad` - Nuevas características
- `bugfix/descripcion-bug` - Corrección de errores
- `hotfix/correcion-urgente` - Fixes críticos
- `refactor/mejora-codigo` - Refactorización

## Envío de Pull Requests

### Antes de Enviar

1. **Actualiza tu rama**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Resuelve conflictos** si existen

### Estructura del Pull Request

**Título**: Breve y descriptivo
- `feat: Add user authentication endpoint`
- `fix: Resolve ticket filtering bug`
- `refactor: Improve repository pattern`

**Descripción**:
```markdown
## Descripción
Breve descripción de los cambios implementados.

## Cambios
- [ ] Nueva funcionalidad X
- [ ] Corrección del bug Y
- [ ] Mejora en el rendimiento Z

## Verificación
- [ ] Compilación exitosa
- [ ] Funcionamiento manual verificado

## Checklist
- [ ] Código sigue los estándares del proyecto
- [ ] Sin errores de compilación
- [ ] Documentación actualizada si es necesario