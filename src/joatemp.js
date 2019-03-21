<Route path="/area/" component={AreaList} />
<Route exact path="/addArea" component={AddArea} />
<Route path="/area/:area_id" component={LocationInArea} />
<Route exact path="/area/:area_id/:id" component={BikesOnLocation} />
<Route exact path="/addLocation/" component={AddLocation} />

------------------------------------------------

getLocations(success) {
  connection.query('select * from Locations', (error, results) => {
    if (error) console.error(error);

    success(results);
  })
}
  // Denne funker ikke som den skal, hva er galt? får inn area_id fra
getLocationsByArea(area_id, success) {
  connection.query('select l.id, l.name, l.area_id from Locations l, Area a where l.area_id = a.id and l.area_id = ?', [area_id], (error, results) => {
    if (error) return console.error(error);
    success(results);
  });
}

addLocation(id, name, postalNum, place, streetAddress, streetNum, area_id, success) {
  connection.query(
    'insert into Locations (name, postalNum, place, streetAddress, streetNum, area_id) value (null, ?, ?,?,?,?)',
    [id, name, postalNum, place, streetAddress, streetNum, area_id],
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    }
  );
}

getArea(success) {
  connection.query('select id as area_id, areaName from Area', (error, results) => {
    if (error) return console.error(error);

    success(results);
  });
}

addArea(id, areaName, success) {
  connection.query('insert into Area (id, areaName) value (null, ?)', [id, areaName], (error, results) => {
    if (error) return console.error(error);

    success(results);
  });
}


---------------------------------------------------------
