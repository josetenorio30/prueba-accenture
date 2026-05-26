# Configuración del proveedor de nube (AWS)
provider "aws" {
  region = "us-east-1"
}

# Aprovisionamiento de la Base de Datos Relacional (RDS MySQL)
resource "aws_db_instance" "mysql_franquicias" {
  identifier           = "franquicias-db-instance"
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "franquicias_db"
  username             = "accenture_user"
  password             = "accenture_password"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
  publicly_accessible  = false

  tags = {
    Environment = "Test"
    Project     = "Accenture-Franquicias-API"
  }
}