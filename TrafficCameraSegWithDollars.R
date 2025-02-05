library(plyr)
library(jsonlite)
library(rgdal)


setwd("C:/Users/admin/WebstormProjects/DCVisionZeroTicketCamera/data")

ldf <- list() # creates a list
listcsv = list.files(pattern="*.csv")

for (k in 1:length(listcsv)){
	dataset <- read.csv(file=listcsv[k],header=TRUE,sep=",") 
	dataset<-subset(dataset, TICKETTYPE=="Photo")
	 count(dataset$STREETSEGID)


	segCounts = aggregate(dataset$TOTALPAID, by=list(dataset$STREETSEGID), FUN=sum)

	fileDateString <-  substring(listcsv[k],22,nchar(listcsv[k])-4)
	fileDateMonth <- substring(fileDateString,0,nchar(fileDateString)-5)
	fileDateNew <- paste( substring(fileDateString,nchar(fileDateMonth)+2),"_",match(fileDateMonth,month.name), sep = "")


	colnames(segCounts)<-c("streetsegi",fileDateString);
	#print(segCounts)

	ldf[[k]] <- segCounts
}


segBase <- list()
for (j in 1:length(ldf)){
segBase <- merge(segBase ,ldf[j], all = TRUE)
}


streetSegis <- readOGR("C:/Users/admin/WebstormProjects/DCVisionZeroTicketCamera/street_segments.geojson", "OGRGeoJSON")


streetSegis <- merge(streetSegis,segBase)


setwd("C:/Users/admin/WebstormProjects/DCVisionZeroTicketCamera")
write.csv(streetSegis, "data.csv", row.names=FALSE, na="0")
