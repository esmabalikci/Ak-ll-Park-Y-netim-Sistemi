-- APAYS Veritabanı Oluşturma Scripti
-- MSSQL (SQL Server) için hazırlanmıştır.

-- Veritabanı zaten varsa hata vermemesi için basit bir kontrol eklenebilir, 
-- ancak bu script temiz bir sunucuda çalıştırılacağı varsayılmıştır.
-- Önce veritabanını oluşturuyoruz. Ancak eğer manuel olarak oluşturduysanız, sadece "USE apays_db;" diyerek başlayabilirsiniz.

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'apays_db')
BEGIN
  CREATE DATABASE apays_db;
END
GO

USE apays_db;
GO

-- 1. Users (Kullanıcılar) Tablosu
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'User', -- 'Admin' veya 'User'
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 2. PicnicAreas (Kamelyalar/Piknik Alanları) Tablosu
IF OBJECT_ID('PicnicAreas', 'U') IS NOT NULL DROP TABLE PicnicAreas;
CREATE TABLE PicnicAreas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Capacity INT NOT NULL,
    IsAvailable BIT NOT NULL DEFAULT 1, -- 1: Müsait, 0: Dolu
    LocationDescription NVARCHAR(500),
    ImageUrl NVARCHAR(500), -- İleride fotoğraf eklemek istersen diye
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 3. Reservations (Rezervasyonlar) Tablosu
IF OBJECT_ID('Reservations', 'U') IS NOT NULL DROP TABLE Reservations;
CREATE TABLE Reservations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PicnicAreaId INT NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Cancelled'
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reservations_UserId FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Reservations_PicnicAreaId FOREIGN KEY (PicnicAreaId) REFERENCES PicnicAreas(Id) ON DELETE CASCADE
);
GO

-- 4. Surveys (Anketler / Memnuniyet) Tablosu
IF OBJECT_ID('Surveys', 'U') IS NOT NULL DROP TABLE Surveys;
CREATE TABLE Surveys (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ReservationId INT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comments NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Surveys_UserId FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Surveys_ReservationId FOREIGN KEY (ReservationId) REFERENCES Reservations(Id) ON DELETE NO ACTION
);
GO

-- 5. SystemLogs (Sistem Kayıtları / Loglar) Tablosu
IF OBJECT_ID('SystemLogs', 'U') IS NOT NULL DROP TABLE SystemLogs;
CREATE TABLE SystemLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ActionType NVARCHAR(100) NOT NULL,
    UserId INT NULL,
    Description NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_SystemLogs_UserId FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION
);
GO

PRINT 'Tüm tablolar başarıyla oluşturuldu! (APAYS Database)';
