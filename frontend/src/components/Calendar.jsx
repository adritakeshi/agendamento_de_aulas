// src/components/Calendar.jsx
import React, { useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

// Criar localizer
const localizer = momentLocalizer(moment);

function Calendar({ aulas, onSelectEvent }) {
  // Transformar aulas para formato do calendário
  const events = useMemo(() => {
    return aulas.map(aula => ({
      id: aula.id,
      title: `${aula.titulo} - ${aula.professor}`,
      start: new Date(aula.data_aula),
      end: new Date(new Date(aula.data_aula).getTime() + aula.duracao_minutos * 60000),
      resource: aula,
      status: aula.status,
      professor: aula.professor,
      especialidade: aula.especialidade,
      preco: aula.preco
    }));
  }, [aulas]);

  const handleSelectEvent = (event) => {
    onSelectEvent(event.resource);
  };

  // Customizar estilo do evento
  const eventStyleGetter = (event) => {
    let backgroundColor = '#4f46e5'; // default azul

    if (event.status === 'concluida') {
      backgroundColor = '#10b981'; // verde
    } else if (event.status === 'cancelada') {
      backgroundColor = '#ef4444'; // vermelho
    } else if (event.status === 'em_progresso') {
      backgroundColor = '#f59e0b'; // amber
    }

    return {
      style: {
        backgroundColor: backgroundColor,
        borderRadius: '6px',
        opacity: 0.85,
        color: 'white',
        border: '2px solid ' + backgroundColor,
        display: 'block',
        padding: '4px 6px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color agendada"></span>
          <span>Agendada</span>
        </div>
        <div className="legend-item">
          <span className="legend-color em_progresso"></span>
          <span>Em Progresso</span>
        </div>
        <div className="legend-item">
          <span className="legend-color concluida"></span>
          <span>Concluída</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cancelada"></span>
          <span>Cancelada</span>
        </div>
      </div>

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        defaultDate={new Date()}
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          showMore: (total) => `+${total} mais`,
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Nenhuma aula neste período',
        }}
        style={{ height: 'calc(100vh - 250px)' }}
      />
    </div>
  );
}

export default Calendar;