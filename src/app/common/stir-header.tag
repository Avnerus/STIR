<stir-header>
<header class="header-bar">
    <div class="pull-left">
        <h1 class="navtext">
            <div class="header-wrapper">
                <a href="" click="{goBack}">
                    <i if="{history && history.length > 0}" id="back-arrow" class="material-icons">arrow_back</i>
                </a>
                <a href="/">
                    <formatted-message id="STIR"/>
                    <span class="role" if="{state.main.role != null}">  |  </span>
                    <formatted-message class="role" if="{state.main.role == 'sleeper'}" id="SLEEPER"/>
                    <formatted-message class="role" if="{state.main.role == 'rouser'}" id="ROUSER"/>
                    <formatted-message class="role" if="{opts.section}" id="{opts.section}"/>
                </a>
            </div>
        </h1>
    </div>
</header>
 <style>
 header {
 
    h1.navtext {
        font-size:1.2rem;
        font-weight: 400;
    }
     span.role, .role span {
        color: #2e2e2e;
     }
     #back-arrow {
        margin-right: 15px;
        color: white;
        position: relative;
        top: 1px;
     }
     .header-wrapper {
        display: flex;
     }
 }
body.fr {
    header {
        h1.navtext {
            font-size:0.9rem;
            font-weight: 400;
        }
    }
} 
 </style>
 <script>
     goBack(e) {
        e.preventDefault();
        history.back();
     }
 </script>
</stir-header>
