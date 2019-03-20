class AreaList extends Component {
  area = [];

  render() {
    return (
      <div>
        <Tab>
          {this.area.map(area => (
            <Tab.Item key={area.a_id} to={'/area/' + area.a_id}>
              {area.areaName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/addArea'}>
              <Button.Light>Legg til nytt område</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    rentalService.getArea(area => {
      this.area = area;
    });
  }
}

class AddArea extends Component {
  areaName = '';

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Nytt område</h5>
          <Row>
            <Column>
              <Form.Label>Navn:</Form.Label>
              <Form.Input type="text" onChange={event => (this.areaName = event.target.value)} />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
                <Column right>
                  <Button.Light onClick={this.cancel}>Cancel</Button.Light>
                </Column>
              </Row>
            </Column>
            <br />
          </Row>
        </div>
      </Card>
    );
  }

  add() {
    rentalService.addArea(this.areaName);

    history.push('/area/1');
  }

  cancel() {
    history.push('/area/1');
  }
}

class LocationInArea extends Component {
  areaLocations = null;
  locations = [];

  render() {
    if (!this.areaLocations) return null;

    return (
      <div>
        <Card>
          <h1 className="display-4">Lokasjoner</h1>
          <br />
          <Tab>
            {this.locations.map(location => (
              <Tab.Item key={location.id} to={'/area/' + location.id}>
                {location.name}
              </Tab.Item>
            ))}
            <Column right>
              <NavLink to={'/addLocation/'}>
                <Button.Light>Legg til ny lokasjon</Button.Light>
              </NavLink>
            </Column>
          </Tab>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getArea(area => {
      this.areaLocations = area;
    });

    rentalService.getLocations(locations => {
      this.locations = locations;
    });
  }
}

class AddLocation extends Component {
  areaNames = [];
  name = '';
  postalNum = 0;
  place = '';
  streetAddress = '';
  streetNum = 0;
  state = { curArea: '' };

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.curArea = event.target.options[selectedIndex].getAttribute('data-key'))
    });
    console.log(this.state.curArea);
  }

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Ny lokasjon</h5>
          <Row>
            <Column>
              <Form.Label>Navn:</Form.Label>
              <Form.Input type="text" onChange={event => (this.areaName = event.target.value)} />
              <Form.Label>Område: </Form.Label>
              <select onChange={this.onChangeLocation}>
                {this.areaNames.map(area => (
                  <option key={area.id} data-key={area.id}>
                    {area.areaName}
                  </option>
                ))}
              </select>
              <br /> <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
                <Column right>
                  <Button.Light onClick={this.cancel}>Cancel</Button.Light>
                </Column>
              </Row>
            </Column>
            <br />
          </Row>
        </div>
      </Card>
    );
  }

  add() {
    rentalService.addLocation(
      this.Name,
      this.postalNum,
      this.place,
      this.streetAddress,
      this.streetNum,
      this.state.curArea
    );

    history.push('/area/1');
  }

  cancel() {
    history.push('/area/1');
  }

  mounted() {
    rentalService.getArea(areaNames => {
      this.state.curArea = areaNames[0].a_id;
      this.areaNames = areaNames;
    });
  }
}

class BikesOnLocation extends Component {
  bikeLocations = null;
  bikes = [];

  render() {
    if (!this.bikeLocations) return null;

    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Liste over sykler på valgt lokasjon</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Typenavn</Table.Th>
                  <Table.Th>Produsent</Table.Th>
                  <Table.Th>År</Table.Th>
                  <Table.Th>Ramme</Table.Th>
                  <Table.Th>Hjul</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Gir</Table.Th>
                  <Table.Th>Bremser</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.year}</Table.Td>
                      <Table.Td>{bike.frameSize}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>{bike.gears}</Table.Td>
                      <Table.Td>{bike.gearSystem}</Table.Td>
                      <Table.Td>{bike.brakeSystem}</Table.Td>
                      <Table.Td>{bike.weight_kg}</Table.Td>
                      <Table.Td>{bike.suitedFor}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.bikeLocations = locations;
    });

    bikeService.getBikesOnLocation(this.props.match.params.id, bikes => {
      this.bikes = bikes;
    });
  }
}


//------------------------------------------------

<Route path="/area/" component={AreaList} />
<Route exact path="/addArea" component={AddArea} />
<Route exact path="/area/:a_id" component={LocationInArea} />
<Route exact path="/area/:id" component={BikesOnLocation} />
<Route exact path="/addLocation/" component={AddLocation} />


//------------

getLocations(success) {
  connection.query('select * from Locations', (error, results) => {
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
  connection.query('select id as a_id, areaName from Area', (error, results) => {
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
