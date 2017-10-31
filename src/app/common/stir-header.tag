<stir-header>
<header class="header-bar">
    <div class="pull-left">
        <h1>
            <a href="/">
                <formatted-message id="STIR"/>
                <span class="role" if="{state.main.role != null}"> | </span>
                <formatted-message class="role" if="{state.main.role == 'sleeper'}" id="SLEEPER"/>
                <formatted-message class="role" if="{state.main.role == 'rouser'}" id="ROUSER"/>
            </a>
        </h1>
    </div>
</header>
 <style>
 header {
     span.role, .role span {
        color: #2e2e2e;
     }
 }
 </style>
 <script>
 </script>
</stir-header>
