class Customers extends Component {
  customers = [
    {
      id:'testnummer',
      firstName:'fornavn1',
      lastName:'etternavn1',
      email:'epostTest',
      phoneNumber:'1234',
      adress:'adressetest'
    }
  ];

  searchCustomerFunction() {
    var customerSearch = "";
    console.log("test!");
  }

  render() {
    return (
        <Card>
          <Row>
            <Column>
              <h6>Kundeliste</h6>
              <input
                id="testSearch"
                type="search"
                onChange={this.searchCustomerFunction}
                placeholder="Søk etter kunde">
              </input>

              <br />
              <br />
              <Table>
                <Table.Thead>
                  <Table.Th>KundeID</Table.Th>
                  <Table.Th>Fornavn</Table.Th>
                  <Table.Th>Etternavn</Table.Th>
                  <Table.Th>Epost</Table.Th>
                  <Table.Th>Telefonnummer</Table.Th>
                  <Table.Th>Adresse</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.customers.map(customer => (
                    <Table.Tr key={customer.id}>
                      <Table.Td>{customer.id}</Table.Td>
                      <Table.Td>{customer.firstName}</Table.Td>
                      <Table.Td>{customer.lastName}</Table.Td>
                      <Table.Td>{customer.email}</Table.Td>
                      <Table.Td>{customer.phoneNumber}</Table.Td>
                      <Table.Td>{customer.adress}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
        </Card>
    );
  }
}
