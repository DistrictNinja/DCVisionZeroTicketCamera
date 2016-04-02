library(plyr)
library(jsonlite)
library(rgdal)


setwd("C:/Users/admin/WebstormProjects/VisionZeroCameraTickets/data")

#streetSegis <- readOGR("C:/Users/admin/WebstormProjects/VisionZeroCameraTickets/street_segments.geojson", "OGRGeoJSON")



ldf <- list() # creates a list
listcsv <- dir(pattern = "*.csv") # creates the list of all the csv files in the directory
for (k in 1:length(listcsv)){
	print(listcsv[k])

	dataset <- read.csv(file=listcsv[k],header=TRUE,sep=",") 
	dataset<-subset(dataset, TICKETTYPE=="Photo")
	segCounts = count(dataset$STREETSEGID)

	fileDateString <-  substring(listcsv[k],22,nchar(listcsv[k])-4)
	fileDateMonth <- substring(fileDateString,0,nchar(fileDateString)-5)
	fileDateNew <- paste( substring(fileDateString,nchar(fileDateMonth)+2),"_",match(fileDateMonth,month.name), sep = "")

	colnames(segCounts)<-c("STREETSEGID",fileDateNew);

	print(segCounts)

	 ldf[[k]] <-segCounts

}

print(toJSON(ldf))


#merge impaired driving incidents with the GeoJSON on a per neigbhorhood basis 
#writeOGR(streetSegis ,"annotatedData.geojson","Streets",driver="GeoJSON");
