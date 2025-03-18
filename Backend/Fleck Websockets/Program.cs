using Fleck;

WebSocketServer server = new WebSocketServer("ws://0.0.0.0:8181");
List<IWebSocketConnection> wsConnections = new List<IWebSocketConnection>();

server.Start(ws => {
    ws.OnOpen = () =>
    {
        Console.WriteLine("New Connection: " + ws);
        wsConnections.Add(ws);
    };

    ws.OnMessage = message =>
    {
        Console.WriteLine(message);
        foreach (var wsConnection in wsConnections)
        {
            wsConnection.Send("New Message: " + message);
        }
    };
});

WebApplication.CreateBuilder(args).Build().Run();
