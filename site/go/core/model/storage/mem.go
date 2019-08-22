package storage

import (
	"errors"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/interfaces"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/model"
)

// MemCircuitStorageInterfaceFactory factory for Mem Circuits Storage Interface
type MemCircuitStorageInterfaceFactory struct {
	memInterface *memCircuitStorage
}

// A simple, array-based circuit storage for testing and example circuits
type memCircuitStorage struct {
	m      []model.Circuit
	nextID model.CircuitID
}

func (mem *memCircuitStorage) inStore(id model.CircuitID) bool {
	return id < int64(len(mem.m))
}

// CreateCircuitStorageInterface creates a circuit storage interface
func (m *MemCircuitStorageInterfaceFactory) CreateCircuitStorageInterface() interfaces.CircuitStorageInterface {
	// Since the storage supports the interface this is fine.  For other kinds of storage, this pattern
	//	of returning a single global object may not be suitable.
	if m.memInterface == nil {
		m.memInterface = &memCircuitStorage{}
	}
	return m.memInterface
}

func (mem *memCircuitStorage) UpdateCircuit(c model.Circuit) {
	if !mem.inStore(c.Metadata.ID) {
		panic(errors.New("circuit did not exist for given id"))
	}
	mem.m[c.Metadata.ID] = c
}

func (mem *memCircuitStorage) EnumerateCircuits(userID model.UserID) []model.CircuitMetadata {
	var ret []model.CircuitMetadata
	for _, v := range mem.m {
		if v.Metadata.Owner == userID {
			ret = append(ret, v.Metadata)
		}
	}
	return ret
}

func (mem *memCircuitStorage) LoadCircuit(id model.CircuitID) *model.Circuit {
	if !mem.inStore(id) {
		return nil
	}
	return &mem.m[id]
}

func (mem *memCircuitStorage) NewCircuit() model.Circuit {
	var c model.Circuit
	c.Metadata.ID = mem.nextID
	mem.m = append(mem.m, c)
	mem.nextID++
	return c
}

func (mem *memCircuitStorage) Close() {}
