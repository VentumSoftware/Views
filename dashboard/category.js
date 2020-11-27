//--------------------------------- Category --------------------------------------------

var dfltState = {
    name: "Form",
    access: {
        names: {
            1: "Admin"
        },
        roles: {
            0: "Admin"
        }
    },
    postUrl: null,
    content: {
        rows: {
            //Rows
            0: {
                cols: {
                    //Columns
                    0: {
                        //Columns elements
                        0: {
                            type: "form",
                            payload: {
                                title: "INTI",
                                cols: {
                                    0: {
                                        0: {
                                            type: "text",
                                            label: "DNI",
                                            placeholder: "DNI"
                                        },
                                        1: {
                                            type: "text",
                                            label: "Nombre",
                                            placeholder: "Nombre"
                                        },
                                        2: {
                                            type: "text",
                                            label: "Apellido",
                                            placeholder: "Apellido"
                                        },
                                        3: {
                                            type: "date",
                                            label: "Fecha N.",
                                            placeholder: ""
                                        },
                                        4: {
                                            type: "text",
                                            label: "Empresa",
                                            placeholder: "Empresa"
                                        },
                                    },
                                    1: {
                                        0: {
                                            type: "text",
                                            label: "Sector",
                                            placeholder: "Sector"
                                        },
                                        1: {
                                            type: "text",
                                            label: "Posición",
                                            placeholder: "Posición"
                                        },
                                        2: {
                                            type: "text",
                                            label: "Mail",
                                            placeholder: "Mail"
                                        },
                                        3: {
                                            type: "text",
                                            label: "Teléfono",
                                            placeholder: ""
                                        },
                                        4: {
                                            type: "text",
                                            label: "Dirección",
                                            placeholder: "Dirección"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    1: {
                        //Columns elements
                        0: {
                            type: "form",
                            payload: {
                                title: "INTI",
                                cols: {
                                    0: {
                                        0: {
                                            type: "text",
                                            label: "DNI",
                                            placeholder: "DNI"
                                        },
                                        1: {
                                            type: "text",
                                            label: "Nombre",
                                            placeholder: "Nombre"
                                        },
                                        2: {
                                            type: "text",
                                            label: "Apellido",
                                            placeholder: "Apellido"
                                        },
                                        3: {
                                            type: "date",
                                            label: "Fecha N.",
                                            placeholder: ""
                                        },
                                        4: {
                                            type: "text",
                                            label: "Empresa",
                                            placeholder: "Empresa"
                                        },
                                    },
                                    1: {
                                        0: {
                                            type: "text",
                                            label: "Sector",
                                            placeholder: "Sector"
                                        },
                                        1: {
                                            type: "text",
                                            label: "Posición",
                                            placeholder: "Posición"
                                        },
                                        2: {
                                            type: "text",
                                            label: "Mail",
                                            placeholder: "Mail"
                                        },
                                        3: {
                                            type: "text",
                                            label: "Teléfono",
                                            placeholder: ""
                                        },
                                        4: {
                                            type: "text",
                                            label: "Dirección",
                                            placeholder: "Dirección"
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            },
            1: {
                cols: {
                    //Columns
                    0: {
                        //Columns elements
                        0: {
                            type: "table",
                            payload: {
                                title: "INTI",
                                fetchPath: "/api/aggregate/Masterbus-IOT/INTI",
                                headers: {
                                    0: {
                                        name: "paquete.Direccion",
                                        label: "Dirección",
                                    },
                                    1: {
                                        name: "paquete.ID",
                                        label: "ID",
                                    },
                                    2: {
                                        name: "paquete.Fecha",
                                        label: "Fecha",
                                    },
                                    3: {
                                        name: "paquete.Hora",
                                        label: "Hora",
                                    },
                                    4: {
                                        name: "paquete.Latitud",
                                        label: "Latitud",
                                    },
                                    5: {
                                        name: "paquete.Longitud",
                                        label: "Longitud",
                                    },
                                    6: {
                                        name: "paquete.Sensor1",
                                        label: "Comb.(S1)",
                                    },
                                    7: {
                                        name: "paquete.Sensor2",
                                        label: "RPMs (S2)",
                                    },
                                    8: {
                                        name: "paquete.Accel",
                                        label: "Aceleración",
                                    },
                                    9: {
                                        name: "paquete.Velocidad",
                                        label: "Velocidad",
                                    }
                                },
                                filters: {
                                    0: {
                                        label: "Desde",
                                        inputs: {
                                            desde: {
                                                name: "fecha-desde",
                                                type: "date",
                                                placeholder: "Desde",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.Fecha",
                                                    op: "$gte",
                                                    transform: "date"
                                                }
                                            }
                                        }
                                    },
                                    1: {
                                        label: "Hasta",
                                        inputs: {
                                            desde: {
                                                name: "fecha-hasta",
                                                type: "date",
                                                placeholder: "Hasta",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.Fecha",
                                                    op: "$lte",
                                                    transform: "date"
                                                }
                                            }
                                        }
                                    },
                                    2: {
                                        label: "ID",
                                        inputs: {
                                            desde: {
                                                name: "ID",
                                                type: "text",
                                                placeholder: "ID",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.ID",
                                                }
                                            }
                                        }
                                    },
                                    3: {
                                        label: "Aceleración",
                                        inputs: {
                                            desde: {
                                                name: "aceleracion-desde",
                                                type: "text",
                                                placeholder: "Desde",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.Accel",
                                                    op: "$gte",
                                                }
                                            },
                                            hasta: {
                                                name: "aceleracion-hasta",
                                                type: "text",
                                                placeholder: "Hasta",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.Accel",
                                                    op: "$lte",
                                                }
                                            }
                                        }
                                    },
                                    4: {
                                        label: "Velocidad",
                                        inputs: {
                                            desde: {
                                                name: "velocidad-desde",
                                                type: "number",
                                                placeholder: "Desde",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.Velocidad",
                                                    op: "$gte",
                                                }
                                            },
                                            hasta: {
                                                name: "velocidad-hasta",
                                                type: "number",
                                                placeholder: "Hasta",
                                                value: "",
                                                required: "",
                                                stage: {
                                                    type: "match",
                                                    var: "paquete.Velocidad",
                                                    op: "$lte",
                                                }
                                            }
                                        }
                                    }
                                },
                                finalStages: {
                                    0: '{"$sort":{"paquete.Fecha":-1,"paquete.Hora":-1}}'
                                }
                            }
                        }
                    }
                }
            }
        },
    }
};

var states = [];

//--------------------------------- Public Interface ------------------------------------

const cmd = (state, cmds, res, pos) => {

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    try {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            return;
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "submit":
                    // c = () => pushForm(state, command.payload);
                    break;
                case "dissmis-modal":
                    // c = () => dismissModal(state, command.payload);
                    break;
                default:
                    console.log(`Cmd not found: ${command.type}`);
                    c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                    break;
            }

            c()
                .then((res) => {
                    cmd(state, cmds, res, pos + 1);
                })
                .catch(err => console.log(err));
        }
    } catch (error) {
        console.log(error);
    }
};

const removeState = (state) => {};

const resetStates = () => {
    if (states.length > 0) {
        states.forEach((el) => {
            el = null;
        })
    }
    states = [];
};

const create = (data, parent) => {

    const navBar = () => {
        var navbarDiv = document.createElement("div");
        navbarDiv.id = state.id + "-content-navbar-div";
        navbarDiv.className = 'ventum-content-navbar-div row';

        var empty = document.createElement("div");
        empty.id = state.id + "-content-navbar-div-exit";
        empty.className = 'col-11';
        navbarDiv.appendChild(empty);

        var exit = document.createElement("div");
        exit.id = state.id + "-content-navbar-div-exit";
        exit.style.position = "relative";
        exit.className = 'col-1 d-flex content-center';
        navbarDiv.appendChild(exit);
        var exitBtn = document.createElement("button");
        exitBtn.id = state.id + "-content-navbar-div-exit";
        exitBtn.className = "btn btn-danger btn-sm";
        exitBtn.style.color = "white";
        exitBtn.style.marginTop = "10%";
        exitBtn.style.marginBottom = "10%";
        exitBtn.innerHTML = "Log Out";
        exitBtn.addEventListener('click', () => {
            logOut(state.logOut);
        });
        exit.appendChild(exitBtn);
        return navbarDiv;
    };

    const separatorLine = () => {
        var line = document.createElement("div");
        line.className = 'ventum-content-separator-line';

        return line;
    };
    try {
        var content = document.createElement("div");
        content.id = state.id + "-content";
        content.className = 'ventum-content '; //overflow-auto
        content.style.overflowY = "auto";
        content.style.overflowX = "hidden";
        content.appendChild(navBar());
        content.appendChild(separatorLine());
        var mainContent = document.createElement("div");
        mainContent.id = state.id + "-content-main";
        mainContent.className = 'ventum-main-content';
        mainContent.style.height = '91%';
        content.appendChild(mainContent);
        return content;
    } catch (error) {
        console.log("Error creating sidebar: " + error);
        return null;
    }

};

export default { create, resetStates, removeState, states };