class SelectedCustomer extends Component {
  state = {
    customer: this.props.activeCustomer,
  };

  active = '';
  ordersByCustomer = [];


  componentWillReceiveProps(nextProps) {
    this.setState({
      customer: nextProps.activeCustomer,
      change: false,
      allOrders: false
     });

    this.active = nextProps.activeCustomer;
  }

  render() {
    if (!this.state.customer) return null;

    if(this.state.change) {

      return (
        <Card>
          <Column>
          <h5>Endre Kunde:</h5>
          <br />
          <Form.Label>Kunde id:</Form.Label>
              <Form.Input type="text" value={this.state.customer.id} disabled />
          <Form.Label>Fornavn:</Form.Label>
              <Form.Input type="text" value={this.active.firstName} onChange={event => (this.active.firstName = event.target.value)} />
          <Form.Label>Etternavn:</Form.Label>
              <Form.Input type="text" value={this.active.lastName} onChange={event => (this.active.lastName = event.target.value)} />
          <Form.Label>Epost:</Form.Label>
              <Form.Input type="text" value={this.active.email} onChange={event => (this.active.email = event.target.value)} />
          <Form.Label>Telefon:</Form.Label>
              <Form.Input type="text" value={this.active.tlf} onChange={event => (this.active.tlf = event.target.value)} />
          <Form.Label>Adresse:</Form.Label>
              <Form.Input type="text" value={this.active.streetAddress} onChange={event => (this.active.streetAddress = event.target.value)} />
          <Form.Label>Gatenummer:</Form.Label>
              <Form.Input type="text" value={this.active.streetNum} onChange={event => (this.active.streetNum = event.target.value)} />
          <Form.Label>Postnummer:</Form.Label>
              <Form.Input type="text" value={this.active.postalNum} onChange={event => (this.active.postalNum = event.target.value)} />
          <Form.Label>Sted:</Form.Label>
              <Form.Input type="text" value={this.active.place} onChange={event => (this.active.place = event.target.value)} />
          <br />
          <Button.Success onClick={(e) => { if (window.confirm('Er du sikker på at du ønsker å gjøre denne endringen?')) this.save (e) }}>Oppdatere informasjon</Button.Success>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button.Danger onClick={this.cancel}>Gå tilbake</Button.Danger>
          </Column>
        </Card>
      )

    } else if (this.state.allOrders) {
      return (
        <Card>
        <br />
        <br />
        <Row>
          <Column>
            <Table>
              <Table.Thead>
                <Table.Th>Ordre-ID</Table.Th>
                <Table.Th>Ordretype</Table.Th>
                <Table.Th>Bestillingsdato</Table.Th>
                <Table.Th>Start for utleie</Table.Th>
                <Table.Th>Slutt for utleie</Table.Th>
                <Table.Th>Pris</Table.Th>
                <Table.Th />
              </Table.Thead>
              <Table.Tbody>
                {this.ordersByCustomer.map(orders => (
                  <Table.Tr key={orders.id}>
                    <Table.Td>{orders.id}</Table.Td>
                    <Table.Td>{orders.typeName}</Table.Td>
                    <Table.Td>{orders.dateOrdered.toString().substring(4, 24)}</Table.Td>
                    <Table.Td>{orders.fromDateTime.toString().substring(4, 24)}</Table.Td>
                    <Table.Td>{orders.toDateTime.toString().substring(4, 24)}</Table.Td>
                    <Table.Td>{orders.price} kr</Table.Td>
                    <Table.Td>
                      <Button.Success type="button" onClick={() => history.push('/customer/' + sale.id + '/edit')}>
                        Se bestilling
                      </Button.Success>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Column>
        </Row>
        </Card>
      )

    } else {

    return (
      <Card>
        <Column>
          <h5>Valgt Kunde:</h5>
          <br />
          <h6>
            {this.state.customer.firstName} {this.state.customer.lastName}
          </h6>
          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Kunde id:</Table.Td>
                <Table.Td>{this.state.customer.id}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Fornavn:</Table.Td>
                <Table.Td>{this.state.customer.firstName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Etternavn:</Table.Td>
                <Table.Td>{this.state.customer.lastName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Epost:</Table.Td>
                <Table.Td>{this.state.customer.email}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Telefon:</Table.Td>
                <Table.Td>{this.state.customer.tlf}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Adresse:</Table.Td>
                <Table.Td>
                  {this.state.customer.streetAddress} {this.state.customer.streetNum}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Poststed:</Table.Td>
                <Table.Td>
                  {this.state.customer.postalNum} {this.state.customer.place}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />
          <Button.Success onClick={this.change}>Endre</Button.Success>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button.Light onClick={this.allOrders}>Se tidligere ordre</Button.Light>
        </Column>
      </Card>
    );
  }
}


  change() {
    this.setState({ change: true });
  }

  allOrders() {
    this.setState({ allOrders: true });
  }

  cancel() {
    this.setState({ change: false });
  }

  mounted() {
    customerService.getCustomer('1', result => {
      this.setState({ state: (this.state.customer = result) });
      this.active = result;
    });

    ordersService.getCustomerOrders()

  }

  save() {
    //Check if address already in database
    customerService.getAddressID(this.active.postalNum, this.active.place, this.active.streetAddress, this.active.streetNum, result => {
      // console.log(result);
      if (result === undefined) {
        customerService.addAddress(this.active.postalNum, this.active.place, this.active.streetAddress, this.active.streetNum);

        customerService.getAddressID(this.active.postalNum, this.active.place, this.active.streetAddress, this.active.streetNum, newID => {
          customerService.updateCustomer(this.active.firstName, this.active.lastName, this.active.email, this.active.tlf, newID.id, this.state.customer.id);
        });
      } else {
        console.log(result.id + " " + this.active.id);
        customerService.updateCustomer(this.active.firstName, this.active.lastName, this.active.email, this.active.tlf, result.id, this.state.customer.id);
      }
    });

    this.setState({ change: false});
  }

}

---------------------------------------------------------


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
              <Form.Input type="text" onChange={event => (this.name = event.target.value)} />
              <Form.Label>Område: </Form.Label>
              <Select onChange={this.onChangeareaName}>
                {this.areaNames.map(areaN => (
                  <Select.Option key={areaN.id} dataKey={areaN.id}>
                    {areaN.areaName}
                  </Select.Option>
                ))}
              </Select>
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
