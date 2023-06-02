const DATE_PICKER = function(
    year = new Date( ).getFullYear( ),
    month = ( new Date( ).getMonth( ) + 1 )
){
  let DOM;
  try{
    DOM = new MINI_DOM( );
  }catch( e ){
    console.error( "Eh wacho, te falta cargar dom.js, que por algo es parte del paquete, capische?" );
    return ;
  }

  let min_date = null;
  let max_date = null;
  let min_month = null;
  let max_month = null;

  let delimiter = ','; //delimitador de las fechas en el input de tipo hidden
  let leading_zero = false;
  let fabriiferroni = [ ]; //por si alguna vez encuentran y leen esto, fabriiferroni es un cordobés sexy, motoquero, hijo de alienígenas, que he inmortalizado en esta variable antes de irse a probar suerte a España... acá habremos de guardar las fechas seleccionadas en el turnero <3
  const months = ['0','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  const input_dates = DOM.create('input', { type: 'hidden', name: 'datepicker-dates' } );
  const table = DOM.create('table', { border: 1, className: 'datepicker' });
  const tbody = DOM.create('tbody');
  const thead_row1_c1 = DOM.create('th'); //anterior
  const thead_row1_c3 = DOM.create('th'); //siguiente
  const span_date = DOM.create( 'span' );
  const btn_prev = DOM.create('a', {
    href:'javascript:void(0)',
    innerHTML: '&lArr;',
    onclick: e => {
      month--;
      if( month < 1 ){ month = 12; year--; }
      draw_table( );
    }
  });
  const btn_next = DOM.create('a', {
    href:'javascript:void(0)',
    innerHTML: '&rArr;',
    onclick: e => {
      month++;
      if( month > 12 ){ month = 1; year++; }
      draw_table( );
    }
  });

  const get_first_weekday = ( year, month ) => {
    const curr_date = new Date( );
    curr_date.setFullYear( year );
    curr_date.setMonth( month - 1 );
    curr_date.setDate( 1 );
    return curr_date.getDay( );
  }

  const get_last_day = ( year, month ) => {
    const curr_date = new Date( );
    curr_date.setFullYear( year );
    curr_date.setMonth( month );
    curr_date.setDate( 0 );
    return curr_date.getDate( ); // 30, 31, 28, 29
  }
  
  const enable_clicks = ( ) => {
    const tds = tbody.querySelectorAll( 'td' );
    Array.from( tds ).forEach(td => {
      const fecha = td.dataset.fecha;
  
      if( fecha < min_date || fecha > max_date ){
        td.classList.add( 'disabled' );
        return;
      }
  
      td.addEventListener('click', e => {
        td.classList.toggle( 'active' );
        if( td.classList.contains( 'active' ) ){
          //si tiene active DESPUES del toggle, es porque tengo que agregar la fecha a la constante fabriiferroni
          fabriiferroni.push(fecha);
        }else{
          //aca tengo que eliminar la fecha, porque es casi seguro que ya estaba en el array de fabriifrerroni
          fabriiferroni = fabriiferroni.filter( f => f != fecha );
        }

        input_dates.value = fabriiferroni.join( delimiter ); 
        console.log( fabriiferroni );
      });
    });
  } 

  const enable_prev_next = ( current_month ) => {
    if( current_month <= min_month ){
      btn_prev.remove( );
    }else{
      DOM.append( btn_prev, thead_row1_c1 ); 
    }

    if( current_month >= max_month ){
      btn_next.remove( );
    }else{
      DOM.append( btn_next, thead_row1_c3 ); 
    }
  }

  const getDateNumber = num => {
    return num.toString( ).padStart( 2, '0' );
  }

  const draw_table = ( ) => {
    span_date.innerHTML = `${months[month]} ${year}`;
    
    initial_day = 1;
    last_day = get_last_day( year, month );
    last_day_prev_month = get_last_day( year, month - 1);
    initial_weekday = get_first_weekday( year, month );
    last_total_number = last_day + initial_weekday;

    let day_number = 1;

    //aca va la logica de cuantos dias tiene el mes, si empieza el 1 en domingo o en jueves... etc
    let html = `<tr>`
    for( let i = initial_day; i <= last_total_number; i++ ){
      if( i <= initial_weekday ){
        const num = last_day_prev_month - initial_weekday + i;

        let current_year = year;
        let current_month = month - 1;
        if( current_month < 1 ){
          current_month = 12;
          current_year = current_year - 1;
        }
        const current_date = `${current_year}-${getDateNumber(current_month)}-${num}`;

        html +=`<td class='prev-month' data-fecha='${current_date}'>${ num }</td>`;
      }else{
        const num = leading_zero ? getDateNumber( day_number ) : day_number;

        const current_date = `${year}-${getDateNumber( month )}-${ getDateNumber( num )}`;
        const class_css = fabriiferroni.includes( current_date ) ? 'class="active"' : '';
        html +=`<td ${ class_css } data-fecha='${current_date}'>${ num }</td>`;
        day_number++;
      }
      if( i % 7 == 0 ) html += '</tr><tr>'; 
    }
    if( last_total_number % 7 != 0 ){
      //falta rellenar
      const total_rows = Math.ceil(last_total_number / 7);
      const total_cells = total_rows * 7;
      const missing_cells = total_cells - last_total_number;
      for( let i = 1; i <= missing_cells; i++ ){
          const num = leading_zero ? getDateNumber( i ) : i;
          let current_year = year;
          let current_month = month + 1;
          if( current_month > 12 ){
            current_month = 1;
            current_year = current_year + 1;
          }
          const current_date = `${current_year}-${getDateNumber(current_month)}-${getDateNumber(i)}`
          html +=`<td class='next-month' data-fecha='${current_date}'>${ num }</td>`;
      }
    }
    html += `</tr>`;
    
    tbody.innerHTML = html;

    enable_clicks( );
    enable_prev_next( `${year}-${ getDateNumber( month ) }` );
  }

  this.setClassName = className => {
    table.className = className;
  }

  this.setLeadingZero = ( bool = true ) => {
    leading_zero = bool;
  }

  this.setMinDate = ( new_date = null ) => {
    min_date = new_date;
    array_date = new_date.split( '-' );
    array_date.pop( );
    min_month = array_date.join( '-' );
  }

  this.setMaxDate = ( new_date = null ) => {
    max_date = new_date;
    array_date = new_date.split( '-' );
    array_date.pop( );
    max_month = array_date.join( '-' );
  }


  this.setSelectedDates = ( array_dates = [ ] ) => {
    fabriiferroni = fabriiferroni.concat( array_dates );
    input_dates.value = fabriiferroni.join( delimiter );
  }


  this.setInputName = ( name = 'datepicker-dates' ) => {
    input_dates.name = name;
  }

  this.setDelimiter = ( param = ',' ) => {
    delimiter = param;
    input_dates.value = fabriiferroni.join( delimiter );
  }

  this.render = ( contenedor = 'body' ) => {
    const thead = DOM.create('thead');
    const thead_row1 = DOM.create('tr');
    const thead_row1_c2 = DOM.create('th', { colSpan: 5 }); //mes-año actual
    const thead_row2 = DOM.create('tr', { innerHTML: `
      <th>DOM</th>
      <th>LUN</th>
      <th>MAR</th>
      <th>MIE</th>
      <th>JUE</th>
      <th>VIE</th>
      <th>SAB</th>
    ` });
    

    DOM.append( btn_prev, thead_row1_c1 ); 
    DOM.append( span_date, thead_row1_c2 ); 
    DOM.append( btn_next, thead_row1_c3 ); 
    DOM.append( [thead_row1_c1, thead_row1_c2, thead_row1_c3], thead_row1 );
    DOM.append( [thead_row1, thead_row2], thead );
    DOM.append( [thead,tbody], table );
    const parent = DOM.query( contenedor ) ?? document.body;
    
    draw_table( );
    DOM.append( [ input_dates, table ], parent);
  }
}