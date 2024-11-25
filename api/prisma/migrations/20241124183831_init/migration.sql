BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Survey] (
    [id] INT NOT NULL IDENTITY(1,1),
    [surveyIdentifier] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL CONSTRAINT [Survey_version_df] DEFAULT 1,
    [isActive] BIT NOT NULL CONSTRAINT [Survey_isActive_df] DEFAULT 1,
    [userId] INT NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [Survey_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Survey_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Survey_surveyIdentifier_version_key] UNIQUE NONCLUSTERED ([surveyIdentifier],[version])
);

-- CreateTable
CREATE TABLE [dbo].[Field] (
    [id] INT NOT NULL IDENTITY(1,1),
    [surveyId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [typeId] INT NOT NULL,
    [isRequired] BIT NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [Field_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Field_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FieldType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [FieldType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FieldType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Response] (
    [id] INT NOT NULL IDENTITY(1,1),
    [surveyId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Response_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Response_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Answer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [responseId] INT NOT NULL,
    [fieldId] INT NOT NULL,
    [value] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Answer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FieldOption] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fieldId] INT NOT NULL,
    [value] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [FieldOption_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FieldOption_fieldId_idx] ON [dbo].[FieldOption]([fieldId]);

-- AddForeignKey
ALTER TABLE [dbo].[Survey] ADD CONSTRAINT [Survey_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Field] ADD CONSTRAINT [Field_surveyId_fkey] FOREIGN KEY ([surveyId]) REFERENCES [dbo].[Survey]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Field] ADD CONSTRAINT [Field_typeId_fkey] FOREIGN KEY ([typeId]) REFERENCES [dbo].[FieldType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Response] ADD CONSTRAINT [Response_surveyId_fkey] FOREIGN KEY ([surveyId]) REFERENCES [dbo].[Survey]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Answer] ADD CONSTRAINT [Answer_responseId_fkey] FOREIGN KEY ([responseId]) REFERENCES [dbo].[Response]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Answer] ADD CONSTRAINT [Answer_fieldId_fkey] FOREIGN KEY ([fieldId]) REFERENCES [dbo].[Field]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FieldOption] ADD CONSTRAINT [FieldOption_fieldId_fkey] FOREIGN KEY ([fieldId]) REFERENCES [dbo].[Field]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
