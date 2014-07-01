((root, factory) ->
  if typeof exports is 'object' and exports
    factory exports #CommonJS
  else
    if not root.Warden 
      Warden = {}
    else 
      Warden = root.Warden
      factory Warden
    if typeof define is 'function' and define.amd
      define Warden
    else
      root.Warden = Warden
)(this, (Warden) ->
  Warden.hint = ->
    console.log "Warden.plugin"
)