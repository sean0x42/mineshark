use log::info;
use tokio::{
    net::{TcpListener, TcpStream},
    try_join,
};

#[tokio::main]
async fn main() {
    env_logger::init();

    let listener = TcpListener::bind("192.168.20.10:25565").await.unwrap();
    info!("Listening on 192.168.20.10:25565");

    loop {
        info!("Awaiting connection...");
        let (stream, _) = listener.accept().await.unwrap();
        info!("New inbound stream found");

        // A new task is spawned for each connection
        tokio::spawn(async move {
            process(stream).await;
        });
    }
}

async fn process(mut client: TcpStream) {
    let mut server = TcpStream::connect("localhost:25560").await.unwrap();
    info!("Establishing new connection");

    let (mut client_recv, mut client_send) = client.split();
    let (mut server_recv, mut server_send) = server.split();

    let handle_one = async { tokio::io::copy(&mut server_recv, &mut client_send).await };

    let handle_two = async { tokio::io::copy(&mut client_recv, &mut server_send).await };

    try_join!(handle_one, handle_two).unwrap();
}
