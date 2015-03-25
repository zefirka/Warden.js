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
              <div class='nav-cnt'>
                <ul>
                  <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 {{is_active}}"><a href="about.html">About</a></li>
                  <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 {{is_active}}"><a href="docs.html">API</a></li>
                  <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 {{is_active}}"><a href="demo.html">Tutorials</a></li>
                  <li class="col-md-3 col-sm-3 col-xs-6 col-lg-3 {{is_active}}"><a href="download.html">Download</a></li>
                </ul>
              </div>
            </nav>
          </header>
        {{content}}
    </body>
</html>
