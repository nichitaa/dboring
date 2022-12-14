defmodule GatewayWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :gateway

  socket "/socket", GatewayWeb.WorkspaceSocket,
    websocket: true,
    longpoll: false

  @session_options [
    store: :cookie,
    key: "_gateway_key",
    signing_salt: "5lFSq0ma"
  ]

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]

  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug CORSPlug, origin: "*"
  plug GatewayWeb.Router
end
