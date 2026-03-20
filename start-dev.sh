#!/bin/bash

# Script para iniciar o projeto completo
# Uso: ./start-dev.sh

echo "🚀 Iniciando Sistema de Agendamento de Aulas..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para iniciar backend
start_backend() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 Iniciando Backend (Node.js)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    cd backend
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Instalando dependências do backend...${NC}"
        npm install
    fi
    
    echo -e "${GREEN}✓ Backend pronto${NC}"
    echo -e "${GREEN}🌐 http://localhost:5000${NC}"
    echo ""
    
    # Iniciar em background
    npm start &
    BACKEND_PID=$!
    
    cd ..
}

# Função para iniciar frontend
start_frontend() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}⚛️  Iniciando Frontend (React)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    cd frontend
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
        npm install
    fi
    
    echo -e "${GREEN}✓ Frontend pronto${NC}"
    echo -e "${GREEN}🌐 http://localhost:3000${NC}"
    echo ""
    
    # Iniciar em background
    npm start &
    FRONTEND_PID=$!
    
    cd ..
}

# Função para verificar MySQL
check_mysql() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🗄️  Verificando MySQL${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Tentar conectar ao MySQL
    mysql -u root -p -e "USE agendamento_aulas; SELECT COUNT(*) as total_aulas FROM aulas;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ MySQL conectado com sucesso${NC}"
        echo -e "${GREEN}📊 Banco 'agendamento_aulas' encontrado${NC}"
    else
        echo -e "${YELLOW}⚠️  MySQL não respondeu${NC}"
        echo -e "${YELLOW}Execute: mysql -u root -p < backend/database.sql${NC}"
    fi
    echo ""
}

# Main
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  📚 Sistema de Agendamento de Aulas - INÍCIO DO DESENVOLVIMENTO   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificações
check_mysql

# Iniciar serviços
start_backend
sleep 3
start_frontend

# Aguardar serviços
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ SISTEMA INICIADO COM SUCESSO!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Serviços rodando:${NC}"
echo -e "  📱 Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  🔧 Backend:  ${GREEN}http://localhost:5000/api${NC}"
echo -e "  🗄️  Database: ${GREEN}agendamento_aulas${NC}"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para parar todos os serviços${NC}"
echo ""

# Aguardar
wait $BACKEND_PID $FRONTEND_PID

# Cleanup
echo -e "${YELLOW}Parando serviços...${NC}"
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo -e "${GREEN}✓ Sistema parado${NC}"
