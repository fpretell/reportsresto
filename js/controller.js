function totalSales(arr){ // suma total
  return arr.reduce( (a,b) => {return a + b.total} , 0);
}

function totalOrders(arr){ // suma total ordenes
  return arr.reduce( (a,b) => {return a+1} , 0);
}

//Waiters, Cashiers, Zone, Table
function getGroupByName(arr, byName='cashier'){ //Ordenes agrupadas por 'byName'

  let auxSum = [], auxCount = []
  let result = arr.reduce((a, c) => {
    let name = c[byName]
    if (!auxCount.hasOwnProperty(name) && !a.hasOwnProperty(name)){
      a[name]=[];
      auxCount[name]=0;
      auxSum[name]=0;
    }
    auxSum[name] += 1*c.total
    auxCount[name]++
    a[name] = {
                name: c[byName],
                count: auxCount[name],
                total: auxSum[name]
              }
    return a
  }, []
  )
  return result
}

function getGroupOrdered(arr, field, ord='desc'){//obtenemos arr ordenado(ord) por campo (field)
  return Object.values(arr).sort( (a, b) => {
    return ord=='desc' ? b[field]-a[field] : (ord=='asc' ? a[field]-b[field] : 0)
  })
}
//fin Waiters, Cashiers, Zone, Table

// Products
function getProductsFlatt(arr){ //obtenemos Array de Productos vendidos Flatten
  return [].concat(...arr.map( e => e.products))
}

function getProductsGroup(arr){ //obtenemos Array agrupando count y total

  let products=getProductsFlatt(arr)
  let auxSum = [], auxCount = []
  return products.reduce((a, c) => { //reducimos para agrupar por count y total
    let name = c.name
    if (!auxCount.hasOwnProperty(name) && !a.hasOwnProperty(name)){
      a[name]=auxCount[name]=auxSum[name]=0;
    }
    auxCount[name] += 1*c.quantity
    auxSum[name] += 1*c.quantity*c.price
    a[name] = {
                name: c.name,
                count: auxCount[name],
                total: auxSum[name]
              }
    return a
  }, []
  )
}

function getProductsOrdered(arrProducts, name, ord='desc'){
  return Object.values(arrProducts).sort( (a, b) => { //ordenamos segun ord
    return ord=='desc' ? b[name]-a[name] : (ord=='asc' ? a[name]-b[name] : 0)
  })
}
//fin Products

function groupBySumDateClosed(arr, limit=100, name='name', ord='asc'){ //Resumen de ventas por dia

  let auxSum = [], auxCount = [], auxDiners = []
  let auxEfectivo = [], auxCredito = [], auxDebito = []
  let auxEfectivoSum = [], auxCreditoSum = [], auxDebitoSum = []

  let result = arr.reduce((a, c) => {
      // obtenemos primer elemento del string date
      const [dateStr] = c.date_closed.split(" ")
      let name = dateStr
      if (!auxSum.hasOwnProperty(name) && !a.hasOwnProperty(name)){
        // inicializamos variables
        auxCreditoSum[name]=auxSum[name]=auxCount[name]=auxDiners[name]=auxEfectivo[name]=0;
        auxCredito[name]=auxDebito[name]=auxEfectivoSum[name]=auxDebitoSum[name]=a[name]=0;
      }
      //acumulamos variables
      auxSum[name] += 1*c.total
      auxCount[name]++
      auxDiners[name] += 1*c.diners
      c.payments.map( payments => {
          if (payments.type=='Efectivo'){
            auxEfectivo[name]++
            auxEfectivoSum[name] += payments.amount
          }else if (payments.type=='Tarjeta débito'){
            auxDebito[name]++
            auxDebitoSum[name] += payments.amount
          }else if (payments.type=='Tarjeta crédito'){
            auxCredito[name]++
            auxCreditoSum[name] += payments.amount
          }
      });
      // creamos objeto
      a[name] = {
                  name: name,
                  total: auxSum[name],
                  orders:auxCount[name],
                  diners:auxDiners[name],
                  payments:{
                    efectivo:{transactions:auxEfectivo[name], total: auxEfectivoSum[name]},
                    debito:{transactions:auxDebito[name], total: auxDebitoSum[name]},
                    credito:{transactions:auxCredito[name], total: auxCreditoSum[name]}
                  }
                }
      return a
    }, []
  )
  //ordenamos por 'ord', devolvemos primeros 'limit' objetos
  return Object.values(result).slice(0,limit).sort( (a, b) => {
    return ord=='asc' ? new Date(a[name]) - new Date(b[name]) : new Date(b[name]) - new Date(a[name]);
  })

}
