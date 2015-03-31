<!DOCTYPE html>
<html>
    {{head}}
    <body>
        <header>
            <section id='logo' class='hidden-xs hidden-sm'>
              <div class="container">
                <div class='img-container'>
                  <img src="assets/images/logo.png">
                </div>
              </div>
            </section>
            <section id='main' class='hidden-md hidden-lg'>
              <div class="container center">
                <a href="index.html"><h1>Warden.js</h1></a>
              </div>
            </section>
            <nav>
              <ul class='container no-padding'>
                <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 "><a href="about.html">About</a></li>
                <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 "><a href="docs.html">API</a></li>
                <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 "><a href="demo.html">Tutorials</a></li>
                <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 "><a href="download.html">Download</a></li>
                <a href="https://github.com/zefirka/Warden.js" class='fork'></a>
              </ul>
            </nav>
          </header>
        <input type="hidden" id='active_tab' value="{{active_tab}}">
        {{content}}
    </body>
</html>