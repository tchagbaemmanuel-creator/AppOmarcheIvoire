import { Order, OrderDetails } from "@/features/(client)/redux/ordersApi.slice"
import { LatLng } from "react-native-maps"

export function getDestination(order: OrderDetails) : LatLng | undefined{
    switch(order.order.status) {
        case("COLLECTING"):
            return  {
                latitude: order.market.latitude,
                longitude: order.market.longitude 
            }
        case("DELIVERING"):
            return {
                latitude: parseFloat(order.order.locationX),
                longitude: parseFloat(order.order.locationY)
            }
    }
  }