## Global major changes

### v0.4.*
#### Warning! Breaking changes

`version v0.4.0`
  - Removed Host module
  - Removed child/parent conjoining methods and now .fire method runs all children streams
  - Aded method .exec which runs only current stream
  - Added method `.pipe` to stream


### v0.3.*

`version v0.3.5`
  - Fixed array extension
  - Added `pop` method to Host module
  - Added stream's `toString` method
  - Added source maps
  - Fixed `skip` method

`version v0.3.4`
  - Pretty stable version

`version v0.3.3`
  - Fixed `toggleOn` and `swap` methods

`version v0.3.2`
  - Fixed `filterFor`
  - Added tests
  - Added `valueOf` for DataBus which refers to the last taken data
  - Added `Warden.Formula`
  - Added configureable Data Bus values history (3 by default)
  - Renamed internal modules `DataBus` to `Stream`
  - Added `.stream` method to Streams objects, now `Bus` is deprecated
  - Fixed reduce method
  - Fixed `Stream.data.last` reference
   
`version: v0.3.0`

  - Removed datatype analyze
  - Changed terminology of modules.
  - Changed `makeStream` with `Stream`
  - Refactored `Utils` module
  - Refactored `DataBus` module
  - Added performace tests
  - Changed `unique` to `diff`
  - `toggle` now runs first argument
  - Changed lock/unlock logic though `swap` method in DataBus
 - Added `Warden.Worker` and `Warden.Observe`
 - Renamed `Warden.pipline` to `Warden.Pipeline`
 - Renamed `Warden.watcher` to `Warden.Watcher`
 - Added `clear` method at DataBus
 - Fixed errors in `mute`, `reduce`.
 - Extented `map` method
 - Renamed `getCollected` to `collect`
 - Renamed `resolveWith` to `resolve`
 - Removed `equals` and added this functionality to `filter`
 - Removed `syncFlat`
 - Added `alternately`