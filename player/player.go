package player

import "sync"

type Player struct {
	Uuid    string
	Name    string
	ProxyId string
}

type State struct {
	mutex      sync.Mutex
	allPlayers []Player // Is this needed with Go's clever GC?
	byUuid     map[string]*Player
	byProxyId  map[string]*Player
}

func InitState() State {
	return State{
		allPlayers: make([]Player, 0),
		byUuid:     make(map[string]*Player),
		byProxyId:  make(map[string]*Player),
	}
}

func (state *State) RegisterPlayer(player Player) {
	state.mutex.Lock()

	state.allPlayers = append(state.allPlayers, player)
	state.byUuid[player.Uuid] = &player // We should really check if uuid is provided first
	state.byProxyId[player.ProxyId] = &player

	state.mutex.Unlock()
}

func (state *State) FindByUuid(uuid string) *Player {
	state.mutex.Lock()
	defer state.mutex.Unlock()
	return state.byUuid[uuid]
}

func (state *State) FindByProxyId(proxyId string) *Player {
	state.mutex.Lock()
	defer state.mutex.Unlock()
	return state.byProxyId[proxyId]
}

func (state *State) SetDetails(proxyId string, name string, uuid string) bool {
	state.mutex.Lock()
	defer state.mutex.Unlock()

	player := state.FindByProxyId(proxyId)
	if player == nil {
		return false
	}

	player.Name = name
	player.Uuid = uuid
	return true
}
