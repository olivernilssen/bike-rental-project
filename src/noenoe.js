class LocationList extends Component {
  locations = [];

  render() {
    return (
      <div className="bootstrap-iso">
        <Card title="Lokasjoner">
          <Column right>
            <NavLink to={'/add/lokasjon/'}>
              <Button.Light>Legg inn ny lokasjon</Button.Light>
            </NavLink>
          </Column>
          <Tab>
            {this.locations.map(location => (
              <Tab.Item key={location.id} to={'/locations/' + location.id}>
                {location.name}
              </Tab.Item>
            ))}
          </Tab>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.locations = locations;
    });
  }
}

class BikesOnLocation extends Component {
  bikeLocations = [];
  bikes = [];
  bikeTypes = null;

  render() {
    if (!this.bikeTypes) return null;

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
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Rammestørrelse</Table.Th>
                  <Table.Th>Hjulstørrelse</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Girsystem</Table.Th>
                  <Table.Th>Bremsesytem</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikeTypes.map(bike => (
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
    this.bikeTypes = [];
    rentalService.getBikesOnLocation(this.props.match.params.id, bikeType => {
      this.bikeTypes = bikeType;
      // console.log(this.props.history.location.pathname);
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
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Rammestørrelse</Table.Th>
                  <Table.Th>Hjulstørrelse</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Girsystem</Table.Th>
                  <Table.Th>Bremsesytem</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikeLocations.map(bike => (
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
    this.bikeLocations = [];

    rentalService.getBikesOnLocation(this.props.match.params.id, bikes => {
      this.bikeLocations = bikes;
      // console.log(this.props.history.location.pathname);
    });
  }
}
