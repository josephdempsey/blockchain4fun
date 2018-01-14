import React from "react";
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";

const columnsSummary = [
  {
    Header: "Block",
    columns: [
      {
        Header: "Height",
        accessor: "height"
      },
      {
        Header: "Time",
        accessor: "time"
      }
    ]
  },
  {
    Header: "Transactions",
    columns: [
      {
        Header: "Smallest Tx $B",
        accessor: "smallest"
      },
      {
        Header: "Average Tx $B",
        accessor: "average"
      },
      {
        Header: "Largest Tx $B",
        accessor: "largest"
      }
    ]
  },
  {
    Header: "Total",
    columns: [
      {
        Header: "Total Tx",
        accessor: "num_tx"
      },
      {
        Header: "Total Value Tx $B",
        accessor: "total_tx"
      }
    ]
  }
];

const columnsTrasactions = [
  {
    Header: "Block",
    columns: [
      {
        Header: "Hash",
        accessor: "hash"
      }
    ]
  },
  {
    Header: "Transactions",
    columns: [
      {
        Header: "Inputs",
        accessor: "num_input"
      },
      {
        Header: "Outputs",
        accessor: "num_output"
      },
      {
        Header: "Input Ratio",
        accessor: "input_ratio"
      },
      {
        Header: "Transaction Value $B",
        accessor: "value"
      }
    ]
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestFailed: false
    };
  }

  componentDidMount() {
    fetch('http://localhost:8000/summary')
    .then(res => {
            if (!res.ok) {
            throw Error("Failed to get data from api")
        }
        
        return res;
    })
    .then(data => data.json())
    .then(data => {
        this.setState({
            apiData: data
        })
    })
    .catch((erre) =>{
        this.setState({
            requestFailed: true
        })
    })
  }

  render() {
    if (this.state.requestFailed) return <p>Failed!</p>
    if (!this.state.apiData) return <p>Loading...</p>

    return (
      <div>
        <ReactTable
          data={this.state.apiData.summary}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={columnsSummary}
          defaultPageSize={10}
          className="-striped -highlight"
          SubComponent={row => {
            return (
              <div style={{ padding: "20px" }}>
                <em>
                  Transaction Details
                </em>
                <br />
                <br />
                <ReactTable
                  data={this.state.apiData.summary[row.index].tx}
                  filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                  columns={columnsTrasactions}
                  defaultPageSize={10}
                  showPagination={true}
                />
              </div>
            );
          }}
        />
        <br />
      </div>
    );
  }
}

export default App;
